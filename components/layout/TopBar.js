'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function TopBar({ title, email }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="px-6 py-4 border-b border-[#30363D] flex items-center justify-between shrink-0">
      <h1 className="text-white font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-[#8B949E] text-sm">{email}</span>
        <button
          onClick={handleLogout}
          className="text-[#8B949E] hover:text-white text-xs border border-[#30363D] hover:border-[#8B949E] px-2 py-1 rounded-md transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
