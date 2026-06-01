import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MainProvider from '@/components/providers/MainProvider'
import SidebarWrapper from '@/components/activity/SidebarWrapper'

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
    <MainProvider activities={activities || []} categories={categories || []}>
      <div className="flex h-screen bg-[#0D1117]">
        <SidebarWrapper />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {children}
        </div>
      </div>
    </MainProvider>
  )
}
