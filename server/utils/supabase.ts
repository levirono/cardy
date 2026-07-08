import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const serviceKey = config.supabaseServiceKey
  
  if (!url || !serviceKey) {
    throw new Error('Supabase is not configured')
  }

  supabaseClient = createClient(url, serviceKey, {
    auth: { 
      autoRefreshToken: false, 
      persistSession: false 
    }
  })

  return supabaseClient
}

// Helper to get user from request
export async function getUserFromRequest(event: any) {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  const supabase = getSupabaseClient()
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  
  return user
}
