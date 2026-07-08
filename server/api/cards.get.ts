import { getSupabaseClient } from '../utils/supabase'

export default defineEventHandler(async () => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})



