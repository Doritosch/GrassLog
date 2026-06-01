'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const TITLE_MAX = 2000
const CAT_MAX = 40
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function createActivity(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: '로그인이 필요합니다.' }

  const title = formData.get('title')?.toString().trim()
  const category_name = formData.get('category_name')?.toString().trim() || null
  const activity_date = formData.get('activity_date')?.toString()

  if (!title) return { error: '활동 내용을 입력해주세요.' }
  if (title.length > TITLE_MAX) return { error: `${TITLE_MAX}자 이내로 입력해주세요.` }
  if (!activity_date || !DATE_RE.test(activity_date)) return { error: '날짜 형식이 올바르지 않아요.' }

  const { error } = await supabase.from('activity_log').insert({
    user_id: user.id,
    title,
    category_name,
    activity_date,
  })

  if (error) {
    console.error('[createActivity]', { code: error.code, userId: user.id })
    return { error: '활동을 저장하지 못했어요. 잠시 후 다시 시도해주세요.' }
  }

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

  if (error) {
    console.error('[deleteActivity]', { code: error.code, userId: user.id })
    return { error: '삭제하지 못했어요. 잠시 후 다시 시도해주세요.' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function createCategory(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: '로그인이 필요합니다.' }

  const name = formData.get('name')?.toString().trim()
  if (!name) return { error: '카테고리 이름을 입력해주세요.' }
  if (name.length > CAT_MAX) return { error: `${CAT_MAX}자 이내로 입력해주세요.` }

  const { error } = await supabase.from('category').insert({
    user_id: user.id,
    name,
  })

  if (error?.code === '23505') return { error: '이미 존재하는 카테고리예요.' }
  if (error) {
    console.error('[createCategory]', { code: error.code, userId: user.id })
    return { error: '카테고리를 저장하지 못했어요. 잠시 후 다시 시도해주세요.' }
  }

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

  if (error) {
    console.error('[deleteCategory]', { code: error.code, userId: user.id })
    return { error: '카테고리를 삭제하지 못했어요. 잠시 후 다시 시도해주세요.' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
