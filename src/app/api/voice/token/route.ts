import { NextRequest, NextResponse } from 'next/server';

const RATE = new Map<string, { count: number; reset: number }>();

function clientIp(req: NextRequest) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'local'
  );
}

function rateLimit(ip: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const row = RATE.get(ip);
  if (!row || now > row.reset) {
    RATE.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (row.count >= limit) return false;
  row.count += 1;
  return true;
}

/**
 * Mints a short-lived Cartesia agent access token.
 * Mock mode when CARTESIA_API_KEY is unset.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const key = process.env.CARTESIA_API_KEY;
  const agentId = process.env.CARTESIA_AGENT_ID;

  if (!key || !agentId) {
    return NextResponse.json({
      mock: true,
      accessToken: 'mock-token',
      agentId: agentId || 'mock-agent',
      expiresIn: 60,
      message:
        'CARTESIA_API_KEY / CARTESIA_AGENT_ID not set — voice runs in mock mode. Text chat still works.',
    });
  }

  try {
    const res = await fetch('https://api.cartesia.ai/access-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Cartesia-Version': '2026-08-14',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grants: { agent: true }, expires_in: 60 }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: 'Cartesia token failed', detail: text.slice(0, 200) },
        { status: 502 },
      );
    }

    const data = (await res.json()) as { access_token?: string; token?: string };
    const accessToken = data.access_token || data.token;
    if (!accessToken) {
      return NextResponse.json({ error: 'No token in response' }, { status: 502 });
    }

    return NextResponse.json({
      mock: false,
      accessToken,
      agentId,
      expiresIn: 60,
    });
  } catch {
    return NextResponse.json({ error: 'Token request failed' }, { status: 502 });
  }
}
