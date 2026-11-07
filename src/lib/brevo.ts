/** Brevo transactional email (server-only). */

const BREVO_SMTP_URL = 'https://api.brevo.com/v3/smtp/email';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || 'hi@nishal.dev';
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'Nishal';
  const toEmail =
    process.env.BREVO_TO_EMAIL?.trim() || 'nishalamv@gmail.com';

  return { apiKey, senderEmail, senderName, toEmail };
}

interface SendBrevoEmailInput {
  to: { email: string; name?: string };
  sender: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
  subject: string;
  textContent: string;
  htmlContent: string;
}

export async function sendBrevoEmail(input: SendBrevoEmailInput): Promise<{
  ok: boolean;
  status: number;
  messageId?: string;
  error?: string;
}> {
  const { apiKey } = getBrevoConfig();
  if (!apiKey) {
    return { ok: false, status: 500, error: 'BREVO_API_KEY is not configured.' };
  }

  const response = await fetch(BREVO_SMTP_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: input.sender,
      to: [input.to],
      replyTo: input.replyTo,
      subject: input.subject,
      textContent: input.textContent,
      htmlContent: input.htmlContent,
    }),
    signal: AbortSignal.timeout(20_000),
  });

  const text = await response.text();
  let parsed: { messageId?: string; message?: string } | null = null;
  try {
    parsed = JSON.parse(text) as { messageId?: string; message?: string };
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: parsed?.message || `Brevo returned ${response.status}.`,
    };
  }

  return { ok: true, status: response.status, messageId: parsed?.messageId };
}
