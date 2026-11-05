'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { asciiAnimateEnabled } from '@/lib/deviceTier';

/**
 * Footer ASCII via ascii.rest (https://ascii.rest — Nishal-picked).
 * Animated: Banner "NISHAL" + equalizer piece (music/beat).
 * Static figlet-style fallback for reduced-motion / low tiers.
 * ascii.rest pauses offscreen and holds first frame for prefers-reduced-motion.
 */
const Banner = dynamic(
  () => import('ascii.rest/react').then((m) => m.Banner),
  { ssr: false, loading: () => <StaticNishalAscii /> },
);

const Ascii = dynamic(
  () => import('ascii.rest/react').then((m) => m.Ascii),
  { ssr: false, loading: () => null },
);

const STATIC_NISHAL = `  _   _ ___ ____  _   _    _    _
 | \\ | |_ _/ ___|| | | |  / \\  | |
 |  \\| || |\\___ \\| |_| | / _ \\ | |
 | |\\  || | ___) |  _  |/ ___ \\| |___
 |_| \\_|___|____/|_| |_/_/   \\_\\_____|`;

function StaticNishalAscii() {
  return (
    <pre className="kinetic-ascii-static" aria-hidden="true">
      {STATIC_NISHAL}
    </pre>
  );
}

export default function AsciiFooterField() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(asciiAnimateEnabled());
  }, []);

  return (
    <div className="kinetic-ascii">
      <p className="sr-only">Nishal — animated ASCII art of his name and an equalizer, from ascii.rest</p>
      {animate ? (
        <div className="kinetic-ascii-live" aria-hidden="true">
          <Banner
            text="NISHAL"
            label="Nishal name in ASCII block letters"
            mono
            style={{
              lineHeight: 1.1,
              margin: 0,
              color: 'var(--amber)',
              fontSize: '11px',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          />
          <div style={{ marginTop: '0.75rem', opacity: 0.85 }}>
            <Ascii
              piece="equalizer"
              label="ASCII equalizer animation"
              mono
              style={{
                lineHeight: 1.1,
                margin: 0,
                color: 'var(--amber)',
                fontSize: '9px',
                maxWidth: '100%',
                overflow: 'hidden',
              }}
            />
          </div>
        </div>
      ) : (
        <div aria-hidden="true">
          <StaticNishalAscii />
        </div>
      )}
      <p className="kinetic-ascii-credit">
        <a href="https://ascii.rest/" target="_blank" rel="noopener noreferrer">ascii.rest</a>
      </p>
    </div>
  );
}
