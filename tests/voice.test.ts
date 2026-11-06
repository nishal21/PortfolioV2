/**
 * Voice/Talk tests. Everything here is offline: Cartesia is MOCKED (globalThis.fetch
 * is replaced), so these prove our guards and wiring, not the live voice service.
 */
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { answer, SUGGESTED_QUESTIONS } from '../src/lib/voice/localAnswers';
import { allowedOrigins, createRateLimiter, isAllowedRequest } from '../src/lib/voice/tokenGuard';
import { agentSocketUrl } from '../src/lib/voice/config';
import { bytesToBase64, base64ToBytes, pcm16ToFloat32 } from '../src/lib/voice/pcm';
import { fetchVoiceToken } from '../src/lib/voice/agentSession';
import { CSP, htmlSecurityHeaders } from '../src/lib/securityHeaders';

describe('local quick answers (deterministic, repo data only)', () => {
  test('every suggested question gets a non-fallback answer', () => {
    for (const q of SUGGESTED_QUESTIONS) {
      assert.doesNotMatch(answer(q).text, /don't have a quick answer/, q);
    }
  });
  test('project lookup returns the case study link', () => {
    const a = answer('tell me about nekobeat');
    assert.match(a.text, /^NekoBeat/);
    assert.ok(a.links.some((l) => l.href === '/projects/nekobeat'));
  });
  test('contact uses the real email, never the placeholder phone', () => {
    const a = answer('how do I contact you?');
    assert.match(a.text, /nishal@nishal\.dev/);
    assert.doesNotMatch(a.text, /\+91/);
  });
  test('unknown questions admit it instead of guessing', () => {
    assert.match(answer('what is the airspeed of a swallow').text, /don't have a quick answer/);
  });
  test('"world" alone does not trigger World News CLI', () => {
    assert.doesNotMatch(answer('hello world').text, /^World News CLI/);
  });
});

describe('token guard', () => {
  const origins = allowedOrigins('https://nishal.dev', false);
  const h = (o: Record<string, string>) => new Headers(o);

  test('allows same-origin requests from the site', () => {
    assert.ok(isAllowedRequest(h({ origin: 'https://nishal.dev', 'sec-fetch-site': 'same-origin' }), origins));
  });
  test('rejects missing, foreign and cross-site origins', () => {
    assert.equal(isAllowedRequest(h({}), origins), false);
    assert.equal(isAllowedRequest(h({ origin: 'https://evil.example' }), origins), false);
    assert.equal(isAllowedRequest(h({ origin: 'https://nishal.dev', 'sec-fetch-site': 'cross-site' }), origins), false);
  });
  test('loopback self-origin only for local previews', () => {
    assert.ok(isAllowedRequest(h({ origin: 'http://127.0.0.1:3410' }), origins, 'http://127.0.0.1:3410'));
    assert.equal(isAllowedRequest(h({ origin: 'https://evil.example' }), origins, 'https://evil.example'), false);
  });
  test('rate limiter: per key and global caps, window expiry', () => {
    const rl = createRateLimiter({ perKey: 2, windowMs: 1000, globalPerWindow: 3 });
    assert.equal(rl.hit('a', 0), 0);
    assert.equal(rl.hit('a', 10), 0);
    assert.ok(rl.hit('a', 20) > 0);
    assert.equal(rl.hit('b', 30), 0);
    assert.ok(rl.hit('c', 40) > 0, 'global cap');
    assert.equal(rl.hit('a', 1500), 0, 'window expired');
  });
});

describe('POST /api/voice/token (Cartesia MOCKED)', () => {
  const realFetch = globalThis.fetch;
  const env = { ...process.env };
  let calls: { url: string; init: RequestInit }[] = [];
  const req = (origin = 'https://nishal.dev') =>
    new Request('https://nishal.dev/api/voice/token', {
      method: 'POST',
      headers: { origin, 'sec-fetch-site': 'same-origin', 'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 250)}` },
    });

  beforeEach(() => {
    calls = [];
    globalThis.fetch = (async (url: string, init: RequestInit) => {
      calls.push({ url: String(url), init });
      return Response.json({ token: 'mock-token' });
    }) as typeof fetch;
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
    process.env = { ...env };
  });

  test('503 voice_unconfigured without env, and no upstream call', async () => {
    delete process.env.CARTESIA_API_KEY;
    delete process.env.CARTESIA_AGENT_ID;
    const { POST } = await import('../src/app/api/voice/token/route');
    const res = await POST(req());
    assert.equal(res.status, 503);
    assert.deepEqual(await res.json(), { error: 'voice_unconfigured' });
    assert.equal(calls.length, 0);
  });

  test('mints an agent-only 60s token; key stays server side', async () => {
    process.env.CARTESIA_API_KEY = 'sk_mock';
    process.env.CARTESIA_AGENT_ID = 'agent_mock';
    const { POST } = await import('../src/app/api/voice/token/route');
    const res = await POST(req());
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    const body = await res.json();
    assert.deepEqual(body, { token: 'mock-token', agentId: 'agent_mock', expiresIn: 60 });
    assert.doesNotMatch(JSON.stringify(body), /sk_mock/);
    assert.equal(calls[0].url, 'https://api.cartesia.ai/access-token');
    const headers = calls[0].init.headers as Record<string, string>;
    assert.equal(headers.Authorization, 'Bearer sk_mock');
    assert.equal(headers['Cartesia-Version'], '2026-08-14');
    assert.deepEqual(JSON.parse(String(calls[0].init.body)), { grants: { agent: true }, expires_in: 60 });
  });

  test('403 for a foreign origin, before any upstream call', async () => {
    process.env.CARTESIA_API_KEY = 'sk_mock';
    process.env.CARTESIA_AGENT_ID = 'agent_mock';
    const { POST } = await import('../src/app/api/voice/token/route');
    const res = await POST(req('https://evil.example'));
    assert.equal(res.status, 403);
    assert.equal(calls.length, 0);
  });

  test('upstream failure becomes 502 without leaking details', async () => {
    process.env.CARTESIA_API_KEY = 'sk_mock';
    process.env.CARTESIA_AGENT_ID = 'agent_mock';
    globalThis.fetch = (async () => new Response('bad key sk_mock', { status: 401 })) as typeof fetch;
    const { POST } = await import('../src/app/api/voice/token/route');
    const res = await POST(req());
    assert.equal(res.status, 502);
    assert.doesNotMatch(await res.text(), /sk_mock/);
  });
});

describe('client helpers', () => {
  test('fetchVoiceToken maps statuses to error codes (MOCKED fetch)', async () => {
    const f = (status: number, body: unknown = {}) => (async () => Response.json(body, { status })) as unknown as typeof fetch;
    assert.deepEqual(await fetchVoiceToken(f(503)), { ok: false, code: 'unconfigured' });
    assert.deepEqual(await fetchVoiceToken(f(429)), { ok: false, code: 'rate_limited' });
    assert.deepEqual(await fetchVoiceToken(f(502)), { ok: false, code: 'server' });
    const boom = (async () => {
      throw new TypeError('offline');
    }) as unknown as typeof fetch;
    assert.deepEqual(await fetchVoiceToken(boom), { ok: false, code: 'network' });
    assert.deepEqual(await fetchVoiceToken(f(200, { token: 't', agentId: 'agent_x' })), {
      ok: true,
      token: 't',
      agentId: 'agent_x',
    });
  });
  test('socket URL matches the documented v1 endpoint', () => {
    const u = new URL(agentSocketUrl('agent_x', 'tok'));
    assert.equal(u.origin + u.pathname, 'wss://api.cartesia.ai/v1/agents/websocket/agent_x');
    assert.equal(u.searchParams.get('cartesia_version'), '2026-08-14');
    assert.equal(u.searchParams.get('access_token'), 'tok');
  });
  test('PCM base64 round trip', () => {
    const bytes = new Uint8Array([0x00, 0x80, 0xff, 0x7f, 0, 0]);
    assert.deepEqual(base64ToBytes(bytesToBase64(bytes)), bytes);
    const f = pcm16ToFloat32(bytes);
    assert.equal(f[0], -1);
    assert.ok(f[1] > 0.999);
    assert.equal(f[2], 0);
  });
});

describe('security headers', () => {
  test('only the exact Cartesia socket host is added', () => {
    assert.match(CSP, /connect-src 'self' https: wss:\/\/api\.cartesia\.ai(;|$)/);
    assert.doesNotMatch(CSP, /wss:(\s|;|$)/);
  });
  test('microphone limited to this origin', () => {
    const pp = htmlSecurityHeaders().find((x) => x.key === 'Permissions-Policy');
    assert.equal(pp?.value, 'camera=(), microphone=(self), geolocation=()');
  });
});
