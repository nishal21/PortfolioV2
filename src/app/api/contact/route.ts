import { contactMail } from '@/data/contact';
import { getBrevoConfig, sendBrevoEmail } from '@/lib/brevo';
import { buildOwnerContactEmail, buildVisitorAckEmail } from '@/lib/contactEmails';

export const dynamic = 'force-dynamic';

/**
 * POST /api/contact — Brevo:
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
