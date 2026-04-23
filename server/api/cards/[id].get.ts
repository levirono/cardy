export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('cards')
    .select('id, title, recipient_name, message, media_type, media_url, background_color, text_color, title_color, message_color, font_family, unlock_at, is_locked, key, opened_at, created_at')
    .eq('id', getRouterParam(event, 'id') as string)
    .single()

  if (error || !data) throw createError({ statusCode: 404, message: 'Card not found' })
  return data
})
