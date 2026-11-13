'use client';

import { useCallback, useEffect, useRef, type RefObject } from 'react';

/**
 * Client half of the contact spam guard (server half: src/lib/contactGuard.ts).
 *
 * When the form scrolls near view it fetches GET /api/contact for a signed ticket
 * (fill-time check) and, only if Turnstile is configured on the server, lazy-loads
 * Cloudflare's script and renders an invisible-unless-needed widget.
 */

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const MIN_FILL_MS = 3_200; // server requires 3s; small margin for clock skew between fetch and post
const TOKEN_WAIT_MS = 15_000;

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')));
    script.onerror = () => {
      scriptPromise = null;
      script.remove();
      reject(new Error('turnstile script failed'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

type Bootstrap = { ticket: string; receivedAt: number; siteKey: string | null };

export const GUARD_ERROR = 'Could not confirm you’re human. Refresh the page and try again.';

export function useContactGuard(
  rootRef: RefObject<HTMLElement | null>,
  widgetRef: RefObject<HTMLDivElement | null>,
  endpoint: string
) {
  const bootRef = useRef<Promise<Bootstrap> | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef('');
  const waitersRef = useRef<((token: string) => void)[]>([]);

  const setToken = useCallback((token: string) => {
    tokenRef.current = token;
    if (token) {
      waitersRef.current.splice(0).forEach((resolve) => resolve(token));
    }
  }, []);

  const renderWidget = useCallback(
    async (siteKey: string) => {
      const el = widgetRef.current;
      if (!el || widgetIdRef.current) return;
      const api = await loadTurnstile();
      if (widgetIdRef.current || !widgetRef.current) return;
      widgetIdRef.current = api.render(widgetRef.current, {
        sitekey: siteKey,
        action: 'contact',
        appearance: 'interaction-only',
        theme: 'auto',
        callback: (token: string) => setToken(token),
        'expired-callback': () => setToken(''),
        'error-callback': () => {
          setToken('');
          return false; // let Turnstile retry on its own
        },
      });
    },
    [setToken, widgetRef]
  );

  const bootstrap = useCallback(() => {
    if (!bootRef.current) {
      bootRef.current = fetch(endpoint, { method: 'GET', headers: { Accept: 'application/json' }, cache: 'no-store' })
        .then(async (res) => {
          if (!res.ok) throw new Error(`bootstrap ${res.status}`);
          const data = (await res.json()) as { ticket?: string; turnstileSiteKey?: string | null };
          if (!data.ticket) throw new Error('no ticket');
          const boot: Bootstrap = { ticket: data.ticket, receivedAt: Date.now(), siteKey: data.turnstileSiteKey || null };
          if (boot.siteKey) void renderWidget(boot.siteKey).catch(() => undefined);
          return boot;
        })
        .catch((err) => {
          bootRef.current = null; // allow a retry on submit
          throw err;
        });
    }
    return bootRef.current;
  }, [endpoint, renderWidget]);

  // Load lazily: only once the form is close to the viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      void bootstrap().catch(() => undefined);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          void bootstrap().catch(() => undefined);
        }
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [bootstrap, rootRef]);

  useEffect(
    () => () => {
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    },
    []
  );

  const waitForToken = useCallback((timeoutMs = TOKEN_WAIT_MS) => {
    if (tokenRef.current) return Promise.resolve(tokenRef.current);
    return new Promise<string>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        waitersRef.current = waitersRef.current.filter((w) => w !== done);
        reject(new Error(GUARD_ERROR));
      }, timeoutMs);
      const done = (token: string) => {
        window.clearTimeout(timer);
        resolve(token);
      };
      waitersRef.current.push(done);
    });
  }, []);

  /** True when Turnstile is on and has no token yet (the form should show "checking…"). */
  const needsVerification = useCallback(async () => {
    const boot = await bootstrap();
    return Boolean(boot.siteKey) && !tokenRef.current;
  }, [bootstrap]);

  /** Adds the ticket (and Turnstile token) to a submission, waiting out the min fill time. */
  const prepare = useCallback(
    async (body: FormData) => {
      let boot: Bootstrap;
      try {
        boot = await bootstrap();
      } catch {
        throw new Error(GUARD_ERROR);
      }
      const wait = boot.receivedAt + MIN_FILL_MS - Date.now();
      if (wait > 0) await new Promise((r) => window.setTimeout(r, wait));
      body.set('_t', boot.ticket);
      if (boot.siteKey) {
        if (!widgetIdRef.current) await renderWidget(boot.siteKey).catch(() => undefined);
        body.set('cf-turnstile-response', await waitForToken());
      }
      return body;
    },
    [bootstrap, renderWidget, waitForToken]
  );

  /** Turnstile tokens are single-use: call after every POST so a retry gets a fresh one. */
  const consumed = useCallback(() => {
    tokenRef.current = '';
    if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
  }, []);

  return { prepare, consumed, needsVerification, waitForToken };
}
