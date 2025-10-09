import { getSupabaseAdmin } from '../../utils/supabaseAdmin'

export default defineEventHandler( async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id)
  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return { ok: true }
})



