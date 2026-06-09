import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080a0c',
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 96,
            fontWeight: 900,
            fontFamily: 'system-ui, Segoe UI, sans-serif',
            letterSpacing: '-0.1em',
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#a6c78c' }}>N</span>
          <span style={{ color: '#d4a854' }}>K</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
