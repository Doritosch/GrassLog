import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ActivitySidebar from '@/components/activity/ActivitySidebar'
import HeatmapInteractive from '@/components/heatmap/HeatmapInteractive'

export default async function GrassPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 364)
  const startStr = startDate.toISOString().split('T')[0]

  const [{ data: activities }, { data: sidebarActivities }] = await Promise.all([
    supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', user.id)
      .gte('activity_date', startStr)
      .order('activity_date', { ascending: false }),
    supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false })
      .limit(50),
  ])

  return (
    <div className="flex h-screen bg-[#0D1117]">
      <ActivitySidebar activities={sidebarActivities || []} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="px-6 py-4 border-b border-[#30363D] flex items-center justify-between shrink-0">
          <h1 className="text-white font-bold">잔디 그래프</h1>
          <span className="text-[#8B949E] text-sm">{user.email}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <HeatmapInteractive activities={activities || []} theme="green" days={365} />
        </div>
      </main>
    </div>
  )
}
