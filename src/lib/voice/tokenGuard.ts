/**
 * Abuse guards for the voice token route. Pure functions so they are testable.
 * The in-memory limiter is per server instance (best effort on serverless);
 * pair it with a platform rate-limit rule in production.
 */

export function allowedOrigins(
  siteUrl: string | undefined,
  isDev: boolean,
  localOrigins?: string,
): string[] {
  const origins = new Set<string>();
  try {
    if (siteUrl) origins.add(new URL(siteUrl).origin);
  } catch {
    /* ignore bad env */
  }
  origins.add('https://nishal.dev');
  origins.add('https://www.nishal.dev');
  if (isDev) {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }
  // Explicit local previews (e.g. `next start -H 127.0.0.1`, where request.url
  // reports localhost). Only plain-http loopback origins are accepted.
  for (const raw of (localOrigins ?? '').split(',')) {
    const o = loopbackOrigin(raw.trim());
    if (o) origins.add(o);
  }
  return [...origins];
}

/** Require a same-site browser request from an allowed origin. */
export function isAllowedRequest(headers: Headers, origins: string[], requestOrigin?: string): boolean {
  const origin = headers.get('origin');
  if (!origin) return false;
  const allowed = origins.includes(origin) || (requestOrigin !== undefined && origin === requestOrigin && isLoopback(origin));
  if (!allowed) return false;
  const site = headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') return false;
  return true;
}

function loopbackOrigin(raw: string): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'http:' || !isLoopback(u.origin) || u.origin !== raw.replace(/\/$/, '')) return null;
    return u.origin;
  } catch {
    return null;
  }
}

function isLoopback(origin: string) {
  try {
    const { hostname } = new URL(origin);
    return hostname === '127.0.0.1' || hostname === 'localhost';
  } catch {
    return false;
  }
}

export interface RateLimiter {
  /** Returns seconds to wait, or 0 when allowed (and records the hit). */
  hit(key: string, now?: number): number;
}

export function createRateLimiter(opts: {
  perKey: number;
  windowMs: number;
  globalPerWindow: number;
}): RateLimiter {
  const hits = new Map<string, number[]>();
  let global: number[] = [];

  return {
    hit(key, now = Date.now()) {
      const since = now - opts.windowMs;
      global = global.filter((t) => t > since);
      const mine = (hits.get(key) ?? []).filter((t) => t > since);

      const blockedBy = mine.length >= opts.perKey ? mine : global.length >= opts.globalPerWindow ? global : null;
      if (blockedBy) {
        hits.set(key, mine);
        return Math.max(1, Math.ceil((blockedBy[0] + opts.windowMs - now) / 1000));
      }

      mine.push(now);
      global.push(now);
      hits.set(key, mine);
      if (hits.size > 5000) hits.clear(); // bound memory
      return 0;
    },
  };
}

export function clientKey(headers: Headers): string {
  const fwd = headers.get('x-nf-client-connection-ip') ?? headers.get('x-forwarded-for') ?? '';
  return fwd.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown';
}
