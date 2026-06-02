import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0D1117',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
        }}
      >
        {/* 아이소메트릭 로고 */}
        <svg width="180" height="180" viewBox="0 0 32 32" fill="none">
          <polygon points="4,18 10,14 10,22 4,26" fill="#0e4429"/>
          <polygon points="10,18 16,14 16,22 10,26" fill="#0e4429"/>
          <polygon points="16,18 22,14 22,22 16,26" fill="#0e4429"/>
          <polygon points="10,14 16,10 16,18 10,22" fill="#006d32"/>
          <polygon points="16,14 22,10 22,18 16,22" fill="#006d32"/>
          <polygon points="22,14 28,10 28,18 22,22" fill="#006d32"/>
          <polygon points="4,18 10,14 16,18 10,22" fill="#26a641"/>
          <polygon points="10,14 16,10 22,14 16,18" fill="#39d353"/>
          <polygon points="16,10 22,6  28,10 22,14" fill="#39d353"/>
          <polygon points="10,22 16,18 22,22 16,26" fill="#26a641"/>
          <polygon points="16,18 22,14 28,18 22,22" fill="#26a641"/>
          <polygon points="4,26  10,22 16,26 10,30" fill="#006d32"/>
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ color: '#ffffff', fontSize: '80px', fontWeight: 'bold', lineHeight: 1 }}>
            GrassLog
          </span>
          <span style={{ color: '#8B949E', fontSize: '32px' }}>
            나의 활동을 잔디로 기록하세요
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
