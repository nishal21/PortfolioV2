'use client';

import { useEffect, useRef, useState } from 'react';
import { asciiAnimateEnabled, prefersReducedMotion, detectDeviceTier } from '@/lib/deviceTier';

/**
 * Footer sign-off: copper ASCII "NISHAL" + canvas waveform equalizer
 * (replaces broken ascii.rest equalizer piece).
 */
const FIGLET = [
  '███╗   ██╗██╗███████╗██╗  ██╗ █████╗ ██╗     ',
  '████╗  ██║██║██╔════╝██║  ██║██╔══██╗██║     ',
  '██╔██╗ ██║██║███████╗███████║███████║██║     ',
  '██║╚██╗██║██║╚════██║██╔══██║██╔══██║██║     ',
  '██║ ╚████║██║███████║██║  ██║██║  ██║███████╗',
  '╚═╝  ╚═══╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝',
];

const STATIC_EQ = [
  '▁▂▃▅▇█▇▅▃▂▁▂▃▅▇█▇▅▃▂▁▂▃▅▇█▇▅▃▂▁▂▃▅▇█▇▅▃▂▁',
  '▂▃▅▇█▇▅▃▂▁▂▃▅▇█▇▅▃▂▁▂▃▅▇█▇▅▃▂▁▂▃▅▇█▇▅▃▂▁▂',
];

export default function AsciiFooterField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(asciiAnimateEnabled() && detectDeviceTier() >= 2 && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!live) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const chars = ' .:-=+*#%@';

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      ctx.textBaseline = 'top';
    };

    const draw = (t: number) => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const cols = Math.floor(w / 7);
      const rows = Math.max(3, Math.floor(h / 12));
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x / cols;
          const wave =
            0.55 +
            0.35 * Math.sin(nx * Math.PI * 4 + t * 0.003) +
            0.2 * Math.sin(nx * Math.PI * 11 - t * 0.004 + y);
          const kick = Math.pow(Math.max(0, Math.sin(((t / 1000) * 96) / 60 * Math.PI * 2 + nx * 6)), 8);
          const amp = Math.min(1, wave * 0.7 + kick * 0.45);
          const rowAmp = amp * (1 - y / (rows + 0.5));
          const ci = Math.min(chars.length - 1, Math.floor(rowAmp * (chars.length - 1)));
          const ch = chars[ci];
          if (ch === ' ') continue;
          ctx.fillStyle = `rgba(201,149,58,${0.25 + rowAmp * 0.7})`;
          ctx.fillText(ch, x * 7, y * 12);
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize, { passive: true });
    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running) raf = requestAnimationFrame(draw);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }, [live]);

  return (
    <div className="kinetic-ascii">
      <p className="sr-only">Nishal — ASCII name and copper equalizer waveform</p>
      <pre className="kinetic-ascii-name" aria-hidden="true">
        {FIGLET.join('\n')}
      </pre>
      {live ? (
        <canvas ref={canvasRef} className="kinetic-ascii-wave" aria-hidden="true" />
      ) : (
        <pre className="kinetic-ascii-eq-static" aria-hidden="true">
          {STATIC_EQ.join('\n')}
        </pre>
      )}
      <p className="kinetic-ascii-credit">
        Sign-off · beat field
      </p>
    </div>
  );
}
