/**
 * Contact spam-guard tests. Offline: Turnstile's siteverify is MOCKED via fetchImpl.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  MIN_FILL_MS,
  MAX_TICKET_AGE_MS,
  checkContent,
  checkTicket,
  contactClientIp,
  getTurnstileConfig,
  issueTicket,
  verifyTurnstile,
} from '../src/lib/contactGuard';
import { CSP } from '../src/lib/securityHeaders';

const SECRET = 'test-secret';
const msg = (over: Partial<{ name: string; email: string; subject: string; message: string }>) => ({
  name: 'Asha Menon',
  email: 'asha@example.com',
  subject: 'Website for my bakery',
  message: 'Hi Nishal, I run a small bakery in Kochi and need a 4-page site with an order form. Free next week?',
  ...over,
});

describe('signed ticket (min fill time)', () => {
  const t0 = 1_763_000_000_000;
  test('accepts after 3s', () => {
    assert.equal(checkTicket(issueTicket(t0, SECRET), t0 + MIN_FILL_MS + 1, SECRET), 'ok');
  });
  test('too fast', () => {
    assert.equal(checkTicket(issueTicket(t0, SECRET), t0 + 500, SECRET), 'too-fast');
  });
  test('missing / forged / wrong key / expired', () => {
    assert.equal(checkTicket('', t0, SECRET), 'missing');
    assert.equal(checkTicket(`${t0 - 10_000}.forged`, t0, SECRET), 'invalid');
    assert.equal(checkTicket(issueTicket(t0 - 10_000, 'other'), t0, SECRET), 'invalid');
    assert.equal(checkTicket(issueTicket(t0, SECRET), t0 + MAX_TICKET_AGE_MS + 1, SECRET), 'expired');
  });
});

describe('content filter', () => {
  test('real enquiries pass, including ones asking about price', () => {
    assert.deepEqual(checkContent(msg({})), { spam: false });
    assert.deepEqual(checkContent(msg({ subject: 'Quote', message: 'What is your price for a portfolio site?' })), {
      spam: false,
    });
    assert.deepEqual(
      checkContent(msg({ message: 'Loved https://nishal.dev/projects — can we talk about a React Native app next month?' })),
      { spam: false }
    );
    assert.deepEqual(checkContent(msg({ message: 'What a surprise, this scenario is fun' })), { spam: false });
  });
  test('Robertpor and price-bot templates are dropped', () => {
    assert.equal(checkContent(msg({ name: 'Robertpor' })).spam, true);
    assert.equal(checkContent(msg({ subject: 'Hi, I write about the price', message: 'Hola, quería saber tu precio.' })).spam, true);
    assert.equal(checkContent(msg({ subject: 'Hello', message: 'Hi, i writing about your the prices' })).spam, true);
    assert.equal(checkContent(msg({ subject: 'Zdravo, htio sam znati vašu cijenu.', message: 'Zdravo, htio sam znati vašu cijenu.' })).spam, true);
    assert.equal(checkContent(msg({ subject: 'Привет', message: 'Привет, я хотел узнать вашу цену.' })).spam, false); // subject has no price word
    assert.equal(checkContent(msg({ subject: 'Hallo, ich wollte Ihren Preis wissen', message: 'Hallo, ich wollte Ihren Preis wissen.' })).spam, true);
  });
  test('link-only and link floods are dropped', () => {
    assert.equal(checkContent(msg({ message: 'https://spam.example/x' })).spam, true);
    assert.equal(checkContent(msg({ message: 'see [url=https://x.example]this[/url] for more good stuff' })).spam, true);
    assert.equal(
      checkContent(msg({ message: 'a https://a.io b https://b.io c https://c.io d https://d.io e https://e.io more words here' })).spam,
      true
    );
  });
});

describe('turnstile', () => {
  test('off unless both keys are set', () => {
    const keep = { ...process.env };
    delete process.env.TURNSTILE_SITE_KEY;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    assert.equal(getTurnstileConfig().enabled, false);
    process.env.TURNSTILE_SITE_KEY = 'site';
    assert.equal(getTurnstileConfig().enabled, true);
    process.env = keep;
  });
  test('verifies via siteverify (mocked)', async () => {
    let sent = '';
    const ok = (async (_url: unknown, init?: RequestInit) => {
      sent = String(init?.body);
      return new Response(JSON.stringify({ success: true }));
    }) as typeof fetch;
    assert.deepEqual(await verifyTurnstile('tok', 'sec', '1.2.3.4', ok), { ok: true });
    assert.match(sent, /secret=sec/);
    assert.match(sent, /remoteip=1\.2\.3\.4/);
    const bad = (async () => new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }))) as typeof fetch;
    assert.equal((await verifyTurnstile('tok', 'sec', undefined, bad)).ok, false);
    assert.equal((await verifyTurnstile('', 'sec', undefined, ok)).ok, false);
  });
  test('CSP allows the Turnstile script', () => {
    assert.match(CSP, /script-src [^;]*https:\/\/challenges\.cloudflare\.com/);
  });
});

test('client IP prefers nginx X-Real-IP over spoofable X-Forwarded-For', () => {
  assert.equal(contactClientIp(new Headers({ 'x-real-ip': '9.9.9.9', 'x-forwarded-for': '1.1.1.1, 9.9.9.9' })), '9.9.9.9');
  assert.equal(contactClientIp(new Headers({ 'x-forwarded-for': '1.1.1.1, 9.9.9.9' })), '9.9.9.9');
});
