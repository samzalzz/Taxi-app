import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Taxi Leblanc - Service Premium de Transport en Île-de-France';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #131313 0%, #1a1a1a 50%, #131313 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold accent bar at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#d4af37',
          }}
        />

        {/* Decorative corner accents */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            width: '60px',
            height: '60px',
            borderTop: '3px solid #d4af37',
            borderLeft: '3px solid #d4af37',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            width: '60px',
            height: '60px',
            borderBottom: '3px solid #d4af37',
            borderRight: '3px solid #d4af37',
          }}
        />

        {/* Taxi emoji as visual anchor */}
        <div style={{ fontSize: '64px', marginBottom: '16px', display: 'flex' }}>
          🚕
        </div>

        {/* Business name */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-2px',
            marginBottom: '8px',
            display: 'flex',
          }}
        >
          Taxi Leblanc
        </div>

        {/* Gold separator */}
        <div
          style={{
            width: '120px',
            height: '3px',
            background: '#d4af37',
            marginBottom: '24px',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            color: '#d4af37',
            fontStyle: 'italic',
            marginBottom: '32px',
            display: 'flex',
          }}
        >
          Service Premium de Transport en Île-de-France
        </div>

        {/* Service pills */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          {['Aéroport', 'CPAM Agréé', 'Occasions'].map((service) => (
            <div
              key={service}
              style={{
                padding: '10px 24px',
                border: '1.5px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '999px',
                color: '#e0e0e0',
                fontSize: '18px',
                display: 'flex',
              }}
            >
              {service}
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '32px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '16px',
          }}
        >
          <span style={{ display: 'flex' }}>24h/24 · 7j/7</span>
          <span style={{ display: 'flex' }}>Draveil · Paris · Île-de-France</span>
          <span style={{ display: 'flex' }}>+33 6 08 55 03 15</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
