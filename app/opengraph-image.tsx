import { ImageResponse } from 'next/og';

export const alt = 'Habitora — Daily Habit Tracker & Printable Sheets';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #071912 0%, #0f2c20 55%, #183f2e 100%)',
          color: '#fafcf9',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top brand lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#2fe196',
              color: '#071912',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Georgia, serif',
            }}
          >
            H
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Habitora
            </span>
            <span
              style={{
                fontSize: '13px',
                letterSpacing: '0.18em',
                color: '#2fe196',
                textTransform: 'uppercase',
              }}
            >
              Small Steps. Big Changes.
            </span>
          </div>
        </div>

        {/* Center editorial headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
          <div
            style={{
              fontSize: '66px',
              lineHeight: 1.08,
              fontFamily: 'Georgia, serif',
              color: '#ffffff',
            }}
          >
            Build Better Habits. One Day at a Time.
          </div>
          <div style={{ fontSize: '24px', lineHeight: 1.45, color: '#cce6d8' }}>
            Track daily progress online, analyze streaks with clear insights, and export
            printable A4 &amp; A5 habit sheets.
          </div>
        </div>

        {/* Bottom capability strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            borderTop: '1px solid rgba(47, 225, 150, 0.25)',
            paddingTop: '24px',
            fontSize: '18px',
            color: '#9ee8c7',
          }}
        >
          <span>21 · 30 · 60 · 90 · 365 Day Challenges</span>
          <span>•</span>
          <span>Interactive Analytics</span>
          <span>•</span>
          <span>Printable PDF Sheets</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
