'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">GrassLog</h1>
          <p className="text-[#8B949E] mt-2 text-sm">이메일로 로그인하세요</p>
        </div>

        {sent ? (
          <div className="bg-[#161B22] border border-[#238636] rounded-lg p-6 text-center">
            <p className="text-[#3FB950] font-medium">메일을 확인하세요!</p>
            <p className="text-[#8B949E] text-sm mt-2">
              {email} 로 로그인 링크를 보냈어요.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#161B22] border border-[#30363D] rounded-lg text-white placeholder-[#8B949E] focus:outline-none focus:border-[#388BFD] transition-colors"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? '전송 중...' : '로그인 링크 받기'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
