import {
  CARTESIA_API_BASE,
  CARTESIA_VERSION,
  VOICE_TOKEN_TTL_SECONDS,
} from '@/lib/voice/config';
import { allowedOrigins, clientKey, createRateLimiter, isAllowedRequest } from '@/lib/voice/tokenGuard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const limiter = createRateLimiter({ perKey: 4, windowMs: 10 * 60 * 1000, globalPerWindow: 60 });

const noStore = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...noStore, ...extra } });
}

/**
 * POST /api/voice/token
 * Mints a short-lived Cartesia access token with only the `agent` grant
 * (POST https://api.cartesia.ai/access-token). The API key never leaves the server.
 */
export async function POST(request: Request) {
  const apiKey = process.env.CARTESIA_API_KEY;
  const agentId = process.env.CARTESIA_AGENT_ID;
  if (!apiKey || !agentId) return json({ error: 'voice_unconfigured' }, 503);

  const origins = allowedOrigins(
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NODE_ENV !== 'production',
    process.env.VOICE_LOCAL_ORIGINS,
  );
  const selfOrigin = new URL(request.url).origin;
  if (!isAllowedRequest(request.headers, origins, selfOrigin)) return json({ error: 'forbidden' }, 403);

  const wait = limiter.hit(clientKey(request.headers));
  if (wait > 0) return json({ error: 'rate_limited', retryAfter: wait }, 429, { 'Retry-After': String(wait) });

  try {
    const res = await fetch(`${CARTESIA_API_BASE}/access-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Cartesia-Version': CARTESIA_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grants: { agent: true }, expires_in: VOICE_TOKEN_TTL_SECONDS }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });
    if (!res.ok) return json({ error: 'upstream_error' }, 502);
    const data = (await res.json()) as { token?: unknown };
    if (typeof data.token !== 'string' || !data.token) return json({ error: 'upstream_error' }, 502);
    // agentId is an identifier, not a secret; the token is single-grant and short-lived.
    return json({ token: data.token, agentId, expiresIn: VOICE_TOKEN_TTL_SECONDS });
  } catch {
    return json({ error: 'upstream_unreachable' }, 502);
  }
}

export function GET() {
  return json({ error: 'method_not_allowed' }, 405, { Allow: 'POST' });
}
