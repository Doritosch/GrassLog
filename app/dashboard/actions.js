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

export async function createCategory(formData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  console.log('createCategory - user:', user?.id, 'authError:', authError)

  if (!user) return { error: `로그인이 필요합니다. (authError: ${authError?.message})` }

  const name = formData.get('name')?.toString().trim()
  if (!name) return { error: '카테고리 이름을 입력해주세요.' }

  const { error } = await supabase.from('category').insert({
    user_id: user.id,
    name,
  })

  if (error?.code === '23505') return { error: '이미 존재하는 카테고리예요.' }
  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteCategory(id) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: '로그인이 필요합니다.' }

  const { error } = await supabase
    .from('category')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
