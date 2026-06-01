import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/activity/DashboardClient'

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
      .limit(200),
    supabase
      .from('category')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
  ])

  return (
    <DashboardClient
      activities={activities || []}
      categories={categories || []}
    />
  )
}
