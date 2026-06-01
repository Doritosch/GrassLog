import { createClient } from '@/lib/supabase/server'
import DashboardMain from '@/components/activity/DashboardMain'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <DashboardMain email={user.email} />
}
