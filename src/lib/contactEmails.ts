import { escapeHtml } from '@/lib/brevo';

const PREHEADER_PAD =
  '&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;';

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

function firstName(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean)[0] || name.trim() || 'there';
}

function nl2br(escaped: string): string {
  return escaped.replace(/\r\n|\n|\r/g, '<br>');
}

function truncate(text: string, max: number): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max - 1).trimEnd()}…`;
}

function formatInboxTime(date = new Date()): string {
  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
}

const SHARED_HEAD = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<style>
:root{color-scheme:light dark;supported-color-schemes:light dark}
@media (max-width:620px){.wrap{width:100%!important}.pad{padding-left:24px!important;padding-right:24px!important}.h1{font-size:30px!important}}
@media (prefers-color-scheme:dark){.bg{background:#15131c!important}.card{background:#1d1b26!important;border-color:#2e2b3b!important}.tx{color:#ece9f5!important}.mut{color:#a29cb8!important}.line{border-color:#2e2b3b!important}.quote{background:#262335!important}.btn{background:#ece9f5!important}.btn a{color:#15131c!important}.acc{color:#b9adff!important}.av{background:#2d2946!important;color:#cfc6ff!important}}
</style>`;

export function buildOwnerContactEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): { subject: string; textContent: string; htmlContent: string } {
  const { name, email, subject, message } = input;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = nl2br(escapeHtml(message));
  const initials = escapeHtml(initialsFromName(name));
  const time = escapeHtml(formatInboxTime());
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
  const preheader = truncate(`${name}: ${message}`, 90);

  const htmlContent = `<!DOCTYPE html>
<html lang="en"><head>${SHARED_HEAD}<title>New message</title></head>
<body class="bg" style="margin:0;padding:0;background:#f2efe9;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(preheader)}${PREHEADER_PAD}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" bgcolor="#f2efe9"><tr><td align="center" style="padding:32px 14px;">
<table role="presentation" class="wrap card" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#fbfaf7" style="width:600px;max-width:600px;background:#fbfaf7;border:1px solid #e6e1d6;border-radius:20px;overflow:hidden;">
<tr><td style="font-size:0;line-height:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="4" width="34%" bgcolor="#8f84d9" style="height:4px;background:#8f84d9;">&nbsp;</td><td height="4" width="33%" bgcolor="#d9a3b5" style="background:#d9a3b5;">&nbsp;</td><td height="4" width="33%" bgcolor="#dcc79a" style="background:#dcc79a;">&nbsp;</td></tr></table></td></tr>
<tr><td class="pad" style="padding:30px 44px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="48" valign="middle"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" valign="middle" width="38" height="38" bgcolor="#1f1d2b" style="width:38px;height:38px;border-radius:11px;background:#1f1d2b;color:#f1d9a6;font:700 14px/38px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:.02em;">NK</td></tr></table></td>
<td valign="middle" class="mut" style="font:600 11px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#6f6b7d;">nishal.dev &middot; Inbox</td></tr></table></td></tr>
<tr><td class="pad" style="padding:30px 44px 28px;"><h1 class="h1 tx" style="margin:0;font:400 38px/1.12 Georgia,'Times New Roman',serif;letter-spacing:-.02em;color:#1f1d2b;">New message</h1><p class="mut" style="margin:10px 0 0;font:400 16px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#6f6b7d;">Someone wrote in from your portfolio.</p></td></tr>
<tr><td class="pad" style="padding:0 44px 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="56" valign="middle"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td class="av" align="center" valign="middle" width="46" height="46" bgcolor="#e9e4fa" style="width:46px;height:46px;border-radius:23px;background:#e9e4fa;color:#5a49c9;font:700 15px/46px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">${initials}</td></tr></table></td>
<td valign="middle"><div class="tx" style="font:600 17px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f1d2b;">${safeName}</div><a class="acc" href="mailto:${safeEmail}" style="font:400 14.5px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#5a49c9;text-decoration:none;">${safeEmail}</a></td>
<td align="right" valign="top" class="mut" style="font:400 12.5px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#7b7788;">${time}</td></tr></table></td></tr>
<tr><td class="pad" style="padding:0 44px 24px;"><div class="line" style="border-top:1px solid #e6e1d6;padding-top:22px;"><div class="mut" style="font:600 11px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#6f6b7d;">Subject</div><div class="tx" style="margin-top:10px;font:400 22px/1.3 Georgia,'Times New Roman',serif;color:#1f1d2b;">${safeSubject}</div></div></td></tr>
<tr><td class="pad" style="padding:0 44px 28px;"><div class="mut" style="font:600 11px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#6f6b7d;">Message</div><div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="quote" bgcolor="#f1eefb" style="background:#f1eefb;border-left:3px solid #6b5bd6;border-radius:4px 12px 12px 4px;padding:18px 22px;font:400 16px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2b2838;"><span class="tx">${safeMessage}</span></td></tr></table></td></tr>
<tr><td class="pad" style="padding:0 44px 34px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td class="btn" bgcolor="#1f1d2b" style="border-radius:999px;background:#1f1d2b;"><a href="${replyHref}" style="display:inline-block;padding:16px 30px;font:600 15px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#fbfaf7;text-decoration:none;border-radius:999px;">Reply to ${safeName} &rarr;</a></td></tr></table><p class="mut" style="margin:14px 0 0;font:400 13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#7b7788;">Or just hit reply &mdash; it goes straight to ${safeName}.</p></td></tr>
<tr><td class="pad" style="padding:0 44px 34px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="line mut" style="border-top:1px solid #e6e1d6;padding-top:20px;font:400 12.5px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#7b7788;">Sent from the contact form on <a class="acc" href="https://nishal.dev" style="color:#5a49c9;text-decoration:none;">nishal.dev</a>. Reply goes to the visitor.</td></tr></table></td></tr>
</table></td></tr></table></body></html>`;

  return {
    subject: `Portfolio contact: ${subject}`,
    textContent: [
      'New portfolio contact',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n'),
    htmlContent,
  };
}

export function buildVisitorAckEmail(input: {
  name: string;
  subject: string;
  message: string;
}): { subject: string; textContent: string; htmlContent: string } {
  const { name, subject, message } = input;
  const safeFirst = escapeHtml(firstName(name));
  const safeSubject = escapeHtml(subject);
  const safeMessage = nl2br(escapeHtml(message));
  const preheader = truncate(
    `Your message about ${subject} is in my inbox — I’ll reply within a day.`,
    95
  );

  const htmlContent = `<!DOCTYPE html>
<html lang="en"><head>${SHARED_HEAD}<title>Message received</title></head>
<body class="bg" style="margin:0;padding:0;background:#f2efe9;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(preheader)}${PREHEADER_PAD}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" bgcolor="#f2efe9"><tr><td align="center" style="padding:32px 14px;">
<table role="presentation" class="wrap card" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#fbfaf7" style="width:600px;max-width:600px;background:#fbfaf7;border:1px solid #e6e1d6;border-radius:20px;overflow:hidden;">
<tr><td style="font-size:0;line-height:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="4" width="34%" bgcolor="#8f84d9" style="height:4px;background:#8f84d9;">&nbsp;</td><td height="4" width="33%" bgcolor="#d9a3b5" style="background:#d9a3b5;">&nbsp;</td><td height="4" width="33%" bgcolor="#dcc79a" style="background:#dcc79a;">&nbsp;</td></tr></table></td></tr>
<tr><td class="pad" style="padding:30px 44px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="48" valign="middle"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" valign="middle" width="38" height="38" bgcolor="#1f1d2b" style="width:38px;height:38px;border-radius:11px;background:#1f1d2b;color:#f1d9a6;font:700 14px/38px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:.02em;">NK</td></tr></table></td>
<td valign="middle" class="mut" style="font:600 11px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#6f6b7d;">nishal.dev &middot; Message received</td></tr></table></td></tr>
<tr><td class="pad" style="padding:30px 44px 24px;"><h1 class="h1 tx" style="margin:0;font:400 38px/1.12 Georgia,'Times New Roman',serif;letter-spacing:-.02em;color:#1f1d2b;">Thanks, ${safeFirst}.<br>Got it.</h1></td></tr>
<tr><td class="pad" style="padding:0 44px 12px;"><p class="tx" style="margin:0 0 16px;font:400 16.5px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2b2838;">Your message about <strong>${safeSubject}</strong> is in my inbox. I read everything myself and usually reply within a day.</p><p class="tx" style="margin:0 0 16px;font:400 16.5px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2b2838;">If it&rsquo;s urgent, just reply to this email &mdash; it lands straight with me.</p></td></tr>
<tr><td class="pad" style="padding:8px 44px 30px;"><div class="mut" style="font:600 11px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#6f6b7d;">What you sent</div><div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="quote" bgcolor="#f1eefb" style="background:#f1eefb;border-left:3px solid #6b5bd6;border-radius:4px 12px 12px 4px;padding:18px 22px;font:400 16px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2b2838;"><span class="tx"><strong>${safeSubject}</strong><br><span class="mut" style="color:#6f6b7d;">${safeMessage}</span></span></td></tr></table></td></tr>
<tr><td class="pad" style="padding:0 44px 26px;"><div class="tx" style="font:italic 400 22px/1.3 Georgia,'Times New Roman',serif;color:#1f1d2b;">&mdash; Nishal</div><div class="mut" style="margin-top:6px;font:400 13.5px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#6f6b7d;">AMV editor &middot; music producer &middot; full-stack dev, Kerala</div></td></tr>
<tr><td class="pad" style="padding:0 44px 34px;"><a class="acc" href="https://nishal.dev/projects" style="color:#5a49c9;text-decoration:none;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Projects &#8599;</a>&nbsp;&nbsp;&nbsp;<a class="acc" href="https://github.com/nishal21" style="color:#5a49c9;text-decoration:none;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">GitHub &#8599;</a>&nbsp;&nbsp;&nbsp;<a class="acc" href="https://nishal.dev" style="color:#5a49c9;text-decoration:none;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Portfolio &#8599;</a></td></tr>
<tr><td class="pad" style="padding:0 44px 34px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="line mut" style="border-top:1px solid #e6e1d6;padding-top:20px;font:400 12.5px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#7b7788;">You&rsquo;re getting this because you wrote via <a class="acc" href="https://nishal.dev/#contact" style="color:#5a49c9;text-decoration:none;">nishal.dev/#contact</a>. If that wasn&rsquo;t you, you can ignore it.</td></tr></table></td></tr>
</table></td></tr></table></body></html>`;

  return {
    subject: 'Got your message — I’ll reply soon',
    textContent: [
      `Hi ${firstName(name)},`,
      '',
      `Your message about "${subject}" is in my inbox. I usually reply within a day.`,
      '',
      'If it’s urgent, reply to this email.',
      '',
      '— Nishal',
      'https://nishal.dev',
    ].join('\n'),
    htmlContent,
  };
}
