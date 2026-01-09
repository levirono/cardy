import { getSupabaseAdmin } from '../utils/supabaseAdmin'
import { getUserFromRequest } from '../utils/getUser'

export default defineEventHandler(async (event) => {
  const user = await getUserFromRequest(event)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<{
    motivation?: string
    portfolioUrl?: string
  }>(event)

  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('designer_applications')
    .insert({
      user_id: user.id,
      motivation: body.motivation || null,
      portfolio_url: body.portfolioUrl || null,
    })
    .select('*')
    .single()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return data
})

