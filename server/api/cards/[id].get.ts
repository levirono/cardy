import { getSupabaseAdmin } from '../../utils/supabaseAdmin.ts'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw createError({ statusCode: 404, statusMessage: error.message })
  return data
})



