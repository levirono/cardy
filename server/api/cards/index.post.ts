export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin()
  const body = await readBody(event)

  const { data, error } = await supabase
    .from('cards')
    .insert({
      user_id: body.user_id,
      title: body.title,
      recipient_name: body.recipient_name,
      message: body.message,
      media_type: body.media_type || 'text',
      media_url: body.media_url || null,
      background_color: body.background_color || null,
      text_color: body.text_color || null,
      title_color: body.title_color || null,
      message_color: body.message_color || null,
      font_family: body.font_family || null,
      theme_preset: body.theme_preset || null,
      template_id: body.template_id || null,
      unlock_at: body.unlock_at || null,
      is_locked: !!body.unlock_at || false,
      key: body.key || null,
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 400, message: error.message })
  return data
})
