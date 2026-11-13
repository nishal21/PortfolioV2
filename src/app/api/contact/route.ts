import { contactMail } from '@/data/contact';
import { getBrevoConfig, sendBrevoEmail } from '@/lib/brevo';
import { buildOwnerContactEmail, buildVisitorAckEmail } from '@/lib/contactEmails';
import {
  HONEYPOT_FIELDS,
  TICKET_FIELD,
  TURNSTILE_FIELD,
  checkContent,
  checkTicket,
  contactClientIp,
  contactRateLimiter,
  getTurnstileConfig,
  issueTicket,
  verifyTurnstile,
} from '@/lib/contactGuard';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

/** What a bot sees when we silently drop it: the same success shape a person gets. */
function fakeSuccess(reason: string) {
  console.info(`[contact] dropped spam (${reason})`);
  return Response.json({ ok: true, message: 'Message sent.' }, { headers: noStore });
}

/**
 * GET /api/contact — form bootstrap: a signed ticket (fill-time check) and the
 * Turnstile site key when Turnstile is configured. Fetched by the form when it nears view.
 */
export async function GET() {
  const { siteKey } = getTurnstileConfig();
  return Response.json({ ticket: issueTicket(), turnstileSiteKey: siteKey || null }, { headers: noStore });
}

/**
 * POST /api/contact — spam guards (see src/lib/contactGuard.ts), then Brevo:
 * 1) Full submission → BREVO_TO_EMAIL (default nishalamv@gmail.com)
 * 2) Styled ack → visitor (from hi@nishal.dev)
 */
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ ok: false, error: 'Invalid form data.' }, { status: 400 });
  }

  // 1) Honeypot: hidden from people, irresistible to bots.
  if (HONEYPOT_FIELDS.some((field) => String(formData.get(field) ?? '').trim() !== '')) {
    return fakeSuccess('honeypot');
  }

  // 2) Signed ticket from GET: proves the form was loaded, and not submitted in < 3s.
  const ticket = checkTicket(String(formData.get(TICKET_FIELD) ?? ''));
  if (ticket === 'too-fast' || ticket === 'invalid' || ticket === 'missing') {
    return fakeSuccess(`ticket-${ticket}`);
  }
  if (ticket === 'expired') {
    return Response.json(
      { ok: false, error: 'This page has been open a while. Refresh it and send again.' },
      { status: 400, headers: noStore }
    );
  }

  const ip = contactClientIp(request.headers);
  const wait = contactRateLimiter.hit(ip);
  if (wait > 0) {
    return Response.json(
      { ok: false, error: `Too many messages. Try again in ${Math.ceil(wait / 60)} min or email ${contactMail.address}.` },
      { status: 429, headers: { ...noStore, 'Retry-After': String(wait) } }
    );
  }

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!name || !email || !subject || !message) {
    return Response.json({ ok: false, error: 'All fields are required.' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: 'Enter a valid email address.' }, { status: 400 });
  }

  if (name.length > 120 || subject.length > 200 || message.length > 5000) {
    return Response.json({ ok: false, error: 'That message is too long.' }, { status: 400 });
  }

  // 3) Content filter: known spam templates and link-only messages.
  const content = checkContent({ name, email, subject, message });
  if (content.spam) return fakeSuccess(`content-${content.reason}`);

  // 4) Cloudflare Turnstile — enforced only when both keys are configured.
  const turnstile = getTurnstileConfig();
  if (turnstile.enabled) {
    const result = await verifyTurnstile(String(formData.get(TURNSTILE_FIELD) ?? ''), turnstile.secretKey, ip);
    if (!result.ok) {
      console.info(`[contact] turnstile failed (${result.reason})`);
      return Response.json(
        {
          ok: false,
          code: 'turnstile',
          error: 'Could not confirm you’re human. Wait a second and try again.',
        },
        { status: 403, headers: noStore }
      );
    }
  }

  const { apiKey, senderEmail, senderName, toEmail } = getBrevoConfig();
  if (!apiKey) {
    return Response.json(
      {
        ok: false,
        error: `Email is not configured yet. Write to ${contactMail.address} instead.`,
      },
      { status: 503 }
    );
  }

  const ownerMail = buildOwnerContactEmail({ name, email, subject, message });
  const visitorMail = buildVisitorAckEmail({ name, subject, message });

  try {
    const inbound = await sendBrevoEmail({
      sender: { email: senderEmail, name: senderName },
      to: { email: toEmail, name: senderName },
      replyTo: { email, name },
      subject: ownerMail.subject,
      textContent: ownerMail.textContent,
      htmlContent: ownerMail.htmlContent,
    });

    if (!inbound.ok) {
      return Response.json(
        {
          ok: false,
          error: inbound.error || `Could not send. Email ${contactMail.address} directly.`,
        },
        { status: 502 }
      );
    }

    const ack = await sendBrevoEmail({
      sender: { email: senderEmail, name: senderName },
      to: { email, name },
      replyTo: { email: contactMail.address, name: senderName },
      subject: visitorMail.subject,
      textContent: visitorMail.textContent,
      htmlContent: visitorMail.htmlContent,
    });

    if (!ack.ok) {
      return Response.json({
        ok: true,
        message: 'Message received. Confirmation email could not be sent.',
        id: inbound.messageId,
        ackError: ack.error,
      });
    }

    return Response.json({
      ok: true,
      message: 'Message sent.',
      id: inbound.messageId,
      ackId: ack.messageId,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return Response.json(
      {
        ok: false,
        error: timedOut
          ? `Email timed out. Write to ${contactMail.address} directly.`
          : `Could not reach email service. Write to ${contactMail.address} directly.`,
      },
      { status: 502 }
    );
  }
}
