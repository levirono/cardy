// import { getSupabaseAdmin } from '../../utils/supabaseAdmin.ts'
// import { getUserFromRequest } from '../../utils/getUser.ts'
import { getSupabaseAdmin } from '../../utils/supabaseAdmin'
import { getUserFromRequest } from '../../utils/getUser'

export default defineEventHandler(async (event) => {
  const user = await getUserFromRequest(event)
  
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  
  const supabase = getSupabaseAdmin()
  
  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (existing) {
    return existing
  }
  
  // Create profile using admin client (bypasses RLS)
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || null,
      role: user.user_metadata?.role || 'user'
    })
    .select()
    .single()
  
  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }
  
  return data
})

