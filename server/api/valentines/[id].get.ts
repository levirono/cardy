import { getSupabaseClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('valentines')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw createError({ statusCode: 404, statusMessage: error.message })
  return data
})
