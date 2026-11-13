/**
 * Server-side spam guards for POST /api/contact.
 *
 * Layers (cheapest first):
 * 1. Honeypot field — real people never see it; bots fill it.
 * 2. Signed form ticket — issued by GET /api/contact, HMAC-signed, must be ≥ MIN_FILL_MS old.
 *    Bots that POST straight to the endpoint (or submit instantly) are dropped.
 * 3. Content filter — known "Robertpor"-style price spam, link-only messages, link floods.
 * 4. Cloudflare Turnstile — only when TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY are both set.
 * Plus a small per-IP rate limit.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { createRateLimiter } from '@/lib/voice/tokenGuard';

export const HONEYPOT_FIELDS = ['website', '_honey'] as const;
export const TICKET_FIELD = '_t';
export const TURNSTILE_FIELD = 'cf-turnstile-response';

export const MIN_FILL_MS = 3_000;
export const MAX_TICKET_AGE_MS = 24 * 60 * 60 * 1000;

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/* ------------------------------------------------------------------ config */

export function getTurnstileConfig() {
  const siteKey =
    process.env.TURNSTILE_SITE_KEY?.trim() || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || '';
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim() || '';
  // Both or nothing: a site key without a secret (or vice versa) would either let
  // everything through or lock real visitors out, so Turnstile stays off.
  const enabled = Boolean(siteKey && secretKey);
  return { enabled, siteKey: enabled ? siteKey : '', secretKey: enabled ? secretKey : '' };
}

function ticketSecret(): string {
  return (
    process.env.CONTACT_FORM_SECRET?.trim() ||
    process.env.TURNSTILE_SECRET_KEY?.trim() ||
    process.env.BREVO_API_KEY?.trim() ||
    // Last resort for local dev without any keys (email sending is off then anyway).
    'nishal.dev-contact-dev-only'
  );
}

/* ---------------------------------------------------------------- ticket */

function sign(issuedAt: string, secret: string): string {
  return createHmac('sha256', secret).update(`contact:${issuedAt}`).digest('base64url');
}

export function issueTicket(now = Date.now(), secret = ticketSecret()): string {
  const issuedAt = String(now);
  return `${issuedAt}.${sign(issuedAt, secret)}`;
}

export type TicketCheck = 'ok' | 'missing' | 'invalid' | 'too-fast' | 'expired';

export function checkTicket(ticket: string, now = Date.now(), secret = ticketSecret()): TicketCheck {
  if (!ticket) return 'missing';
  const [issuedAt, mac] = ticket.split('.');
  if (!issuedAt || !mac || !/^\d{10,16}$/.test(issuedAt)) return 'invalid';
  const expected = Buffer.from(sign(issuedAt, secret));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return 'invalid';
  const age = now - Number(issuedAt);
  if (age < MIN_FILL_MS) return 'too-fast';
  if (age > MAX_TICKET_AGE_MS) return 'expired';
  return 'ok';
}

/* --------------------------------------------------------------- content */

/** Names used by the multilingual "I write about the price" bot (and its siblings). */
const SPAM_NAMES = [/robertpor/i, /^[a-z]{3,12}por$/i];

/**
 * The "price" bot sends one short line, e.g. "Hi, I write about your the prices",
 * "Hola, quería saber tu precio", "Hallo, ich wollte Ihren Preis wissen" … in dozens
 * of languages. We match the price word only in SHORT messages so a real enquiry with
 * details ("what would you charge for a 5-page site with…") still gets through.
 */
const PRICE_TEMPLATE = [
  /\bwrit(?:e|ing)\s+about\s+(?:your\s+)?(?:the\s+)?prices?\b/i,
  /\b(?:wanted|want)\s+to\s+know\s+(?:your\s+)?(?:the\s+)?prices?\b/i,
];
/** "price" in the languages the bot rotates through. Letter-bounded so "surprise"/"scenario" don't match. */
const PRICE_STEMS = [
  'price', 'prices', 'pricing', 'precio', 'precios', 'preço', 'preços', 'prezzo', 'prezzi', 'prix', 'preis', 'preise',
  'prijs', 'prijzen', 'pris', 'prisen', 'prisene', 'priser', 'cena', 'cenu', 'ceny', 'cenę', 'cene', 'cijena', 'cijenu',
  'cenas', 'kaina', 'kainą', 'hinta', 'hintaa', 'hinda', 'árát', 'árat', 'preț', 'prețul', 'pretul', 'çmim', 'çmimin',
  'fiyat', 'fiyatı', 'fiyatınızı', 'harga', 'giá', 'presyo', 'qiymət', 'praghas', 'phraghas',
  'цена', 'цену', 'цены', 'ціна', 'ціну', 'цената', 'баға', 'үнэ', 'τιμή', 'τιμη',
  'سعر', 'السعر', 'سعرك', 'قیمت', 'מחיר', 'कीमत', 'मूल्य', 'দাম', 'விலை', 'ధర', 'ಬೆಲೆ', 'വില',
];
const PRICE_WORDS = new RegExp(
  `(?<![\\p{L}\\p{M}])(?:${PRICE_STEMS.join('|')})(?![\\p{L}\\p{M}])|ราคา|価格|价格|價格|가격`,
  'iu'
);
const SHORT_MESSAGE = 160;

const URL_RE = /\b(?:https?:\/\/|www\.)\S+/gi;

export type ContentVerdict = { spam: false } | { spam: true; reason: string };

export function checkContent(input: { name: string; email: string; subject: string; message: string }): ContentVerdict {
  const { name, subject, message } = input;
  if (SPAM_NAMES.some((re) => re.test(name.trim()))) return { spam: true, reason: 'name' };

  const compact = message.replace(/\s+/g, ' ').trim();
  const words = compact.split(' ').length;
  // Template wording in a short note (a long, detailed enquiry that happens to say it still passes).
  if (words <= 30 && PRICE_TEMPLATE.some((re) => re.test(`${subject}\n${message}`))) {
    return { spam: true, reason: 'price-template' };
  }
  if (
    words <= 12 &&
    compact.length <= SHORT_MESSAGE &&
    !compact.includes('?') &&
    PRICE_WORDS.test(compact) &&
    (PRICE_WORDS.test(subject) || subject.trim().toLowerCase() === compact.toLowerCase())
  ) {
    // Bare one-liner "about the price", echoed in the subject, no actual question or details.
    return { spam: true, reason: 'price-oneliner' };
  }

  const urls = message.match(URL_RE) ?? [];
  if (urls.length > 0) {
    const withoutUrls = message.replace(URL_RE, '').replace(/[^\p{L}\p{N}]+/gu, '');
    if (withoutUrls.length < 15) return { spam: true, reason: 'link-only' };
  }
  if (urls.length > 4) return { spam: true, reason: 'link-flood' };
  if (/\[url=|<a\s+href=/i.test(message)) return { spam: true, reason: 'markup-links' };

  return { spam: false };
}

/* ------------------------------------------------------------- turnstile */

export type TurnstileResult = { ok: true } | { ok: false; reason: string; retryable: boolean };

export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp?: string,
  fetchImpl: typeof fetch = fetch
): Promise<TurnstileResult> {
  if (!token) return { ok: false, reason: 'missing-token', retryable: true };
  if (token.length > 2048) return { ok: false, reason: 'bad-token', retryable: true };
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp && remoteIp !== 'unknown') body.set('remoteip', remoteIp);
  try {
    const res = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8_000),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean; 'error-codes'?: string[] } | null;
    if (data?.success) return { ok: true };
    return { ok: false, reason: (data?.['error-codes'] ?? ['failed']).join(','), retryable: true };
  } catch {
    return { ok: false, reason: 'siteverify-unreachable', retryable: true };
  }
}

/* ------------------------------------------------------------ rate limit */

export const contactRateLimiter = createRateLimiter({ perKey: 5, windowMs: 10 * 60 * 1000, globalPerWindow: 60 });

/** Client IP as nginx sees it (X-Real-IP is set by our proxy; X-Forwarded-For's first hop is client-controlled). */
export function contactClientIp(headers: Headers): string {
  const real = headers.get('x-real-ip')?.trim();
  if (real) return real;
  const fwd = (headers.get('x-forwarded-for') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return fwd[fwd.length - 1] || 'unknown';
}
