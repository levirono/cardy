export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin()
  const body = await readBody(event)

  const { data, error } = await supabase
    .from('weddings')
    .insert({
      user_id: body.user_id,
      slug: body.slug,
      couple_name_1: body.couple_name_1,
      couple_name_2: body.couple_name_2,
      wedding_date: body.wedding_date,
      venue_name: body.venue_name || null,
      venue_address: body.venue_address || null,
      ceremony_time: body.ceremony_time || null,
      reception_time: body.reception_time || null,
      cover_image_url: body.cover_image_url || null,
      theme_color: body.theme_color || '#d4a5a5',
      theme_preset: body.theme_preset || 'classic',
      welcome_message: body.welcome_message || null,
      story_text: body.story_text || null,
      dress_code: body.dress_code || null,
      additional_info: body.additional_info || null,
      is_published: body.is_published ?? false,
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 400, message: error.message })
  return data
})
