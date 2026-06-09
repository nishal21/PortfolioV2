import { ImageResponse } from 'next/og';

export const size = { width: 48, height: 48 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 4,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 30,
            fontWeight: 900,
            fontFamily: 'system-ui, Segoe UI, sans-serif',
            letterSpacing: '-0.12em',
            lineHeight: 1,
            transform: 'translateY(1px)',
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
