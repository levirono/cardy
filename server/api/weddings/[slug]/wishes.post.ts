export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin()
  const slug = getRouterParam(event, 'slug') as string
  const body = await readBody(event)

  const { data: wedding } = await supabase.from('weddings').select('id').eq('slug', slug).single()
  if (!wedding) throw createError({ statusCode: 404, message: 'Wedding not found' })

  const { data, error } = await supabase.from('wedding_wishes').insert({
    wedding_id: wedding.id,
    guest_name: body.guest_name,
    wish_message: body.wish_message,
    is_approved: true,
  }).select().single()

  if (error) throw createError({ statusCode: 400, message: error.message })
  return data
})
