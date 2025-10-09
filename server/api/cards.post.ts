import { getSupabaseAdmin } from '../utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('cards').insert({
    title: body.title,
    recipient_name: body.recipientName,
    message: body.message,
    media_type: body.mediaType,
    media_url: body.mediaUrl,
    background_color: body.backgroundColor,
    text_color: body.textColor,
    title_color: body.titleColor,
    message_color: body.messageColor,
    font_family: body.fontFamily,
    title_align: body.titleAlign,
    message_align: body.messageAlign,
    title_size: body.titleSize,
    message_size: body.messageSize,
    theme_preset: body.themePreset,
    unlock_at: body.unlockAt,
    is_locked: body.isLocked,
    key: body.key,
  }).select('*').single()
  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})



