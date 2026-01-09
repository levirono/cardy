import { getSupabaseAdmin } from './supabaseAdmin.ts'

export async function getUserFromRequest(event: any) {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  const supabase = getSupabaseAdmin()
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  
  return user
}

