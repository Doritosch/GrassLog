import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MainProvider from '@/components/providers/MainProvider'
import SidebarWrapper from '@/components/activity/SidebarWrapper'
import MobileTabBar from '@/components/layout/MobileTabBar'

export default async function MainLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: activities }, { data: categories }] = await Promise.all([
    supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('category')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
  ])

  return (
    <MainProvider activities={activities || []} categories={categories || []} email={user.email}>
      <div className="flex h-screen bg-[#0D1117]">
        {/* 데스크탑 사이드바 */}
        <div className="hidden md:flex">
          <SidebarWrapper />
        </div>
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {children}
        </div>
      </div>
      {/* 모바일 하단 탭바 */}
      <MobileTabBar />
    </MainProvider>
  )
}
