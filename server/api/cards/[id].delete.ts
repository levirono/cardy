import { getSupabaseClient } from '../../utils/supabase'

export default defineEventHandler( async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id)
  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return { ok: true }
})



