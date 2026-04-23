export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin()
  const slug = getRouterParam(event, 'slug') as string

  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) throw createError({ statusCode: 404, message: 'Wedding not found' })
  return data
})
