import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ActivityForm from '@/components/activity/ActivityForm'
import RecentActivityList from '@/components/activity/RecentActivityList'

export default async function DashboardPage() {
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
      .limit(10),
    supabase
      .from('category')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
  ])

  return (
    <main className="min-h-screen bg-[#0D1117] px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-white font-bold text-xl">GrassLog</h1>
          <span className="text-[#8B949E] text-sm">{user.email}</span>
        </div>

        <ActivityForm categories={categories || []} />
        <RecentActivityList activities={activities || []} />
      </div>
    </main>
  )
}
