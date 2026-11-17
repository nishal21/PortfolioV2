/** Shared security headers for Next.js `headers()` and nginx deploy docs. */

export const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' https:",
  "font-src 'self' data: https:",
  // Cartesia agent socket; Fish Audio sessions signal over LiveKit Cloud (livekit_url wss://<project>.livekit.cloud).
  "connect-src 'self' https: wss://api.cartesia.ai wss://*.livekit.cloud",
  "frame-src https:",
  "form-action 'self' https:",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join('; ');

export const HSTS = 'max-age=31536000; includeSubDomains';

export const HTML_CACHE_CONTROL = 'private, no-cache, no-store, must-revalidate';

export const STATIC_CACHE_CONTROL = 'public, max-age=31536000, immutable';

export function htmlSecurityHeaders() {
  const headers: { key: string; value: string }[] = [
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
    { key: 'Content-Security-Policy', value: CSP },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
    { key: 'Cache-Control', value: HTML_CACHE_CONTROL },
    { key: 'Pragma', value: 'no-cache' },
    { key: 'Expires', value: '0' },
  ];

  if (process.env.NODE_ENV === 'production') {
    headers.push({ key: 'Strict-Transport-Security', value: HSTS });
  }

  return headers;
}
