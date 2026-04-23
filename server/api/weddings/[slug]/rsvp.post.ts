export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin()
  const slug = getRouterParam(event, 'slug') as string
  const body = await readBody(event)

  // Verify wedding exists
  const { data: wedding } = await supabase.from('weddings').select('id').eq('slug', slug).single()
  if (!wedding) throw createError({ statusCode: 404, message: 'Wedding not found' })

  const { data, error } = await supabase.from('wedding_rsvps').insert({
    wedding_id: wedding.id,
    guest_name: body.guest_name,
    guest_email: body.guest_email || null,
    attendance_status: body.attendance_status,
    how_they_know: body.how_they_know || 'both',
    how_they_know_detail: body.how_they_know_detail || null,
    dietary_restrictions: body.dietary_restrictions || null,
    plus_one: body.plus_one || false,
    plus_one_name: body.plus_one_name || null,
    message_to_couple: body.message_to_couple || null,
  }).select().single()

  if (error) throw createError({ statusCode: 400, message: error.message })
  return data
})
