'use client'

import { createClient } from '@/lib/supabase/client'

function isKakaoInAppBrowser() {
  if (typeof navigator === 'undefined') return false
  return /KAKAOTALK/i.test(navigator.userAgent)
}

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    if (isKakaoInAppBrowser()) {
      const cleanUrl = `${window.location.origin}/login`
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(cleanUrl)}`
      return
    }

    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1 mb-4">
            <div className="grid grid-cols-5 gap-0.5">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{
                    backgroundColor: ['#161B22', '#0e4429', '#006d32', '#26a641', '#39d353'][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              ))}
            </div>
          </div>
          <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">GrassLog</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">오늘의 활동을 기록하고 잔디를 채워보세요</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg font-medium transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
            </svg>
            Google로 로그인
          </button>
        </div>
      </div>
    </main>
  )
}
