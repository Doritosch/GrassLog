import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="text-[#8B949E]">안녕하세요, {user.email}</p>
        <p className="text-[#3FB950] text-sm">로그인 성공! 🎉</p>
      </div>
    </main>
  )
}
