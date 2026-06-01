'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createActivity(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: '로그인이 필요합니다.' }

  const title = formData.get('title')?.toString().trim()
  const category_name = formData.get('category_name')?.toString().trim() || null
  const activity_date = formData.get('activity_date')?.toString()

  if (!title || title.length === 0) return { error: '활동 내용을 입력해주세요.' }
  if (!activity_date) return { error: '날짜를 입력해주세요.' }

  const { error } = await supabase.from('activity_log').insert({
    user_id: user.id,
    title,
    category_name,
    activity_date,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteActivity(id) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: '로그인이 필요합니다.' }

  const { error } = await supabase
    .from('activity_log')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
