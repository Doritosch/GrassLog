import { createClient } from '@/lib/supabase/server'
import GrassMain from '@/components/heatmap/GrassMain'

export default async function GrassPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <GrassMain email={user.email} />
}
