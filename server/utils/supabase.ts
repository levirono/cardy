import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export const useSupabaseServer = () => {
    if (supabaseClient) {
        return supabaseClient
    }

    const config = useRuntimeConfig()

    supabaseClient = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    return supabaseClient
}

export const useSupabaseAdmin = () => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.supabaseServiceKey as string
  if (!url || !key) throw new Error('Supabase admin config missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

export const getSupabaseUser = async (event: any) => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const anonKey = config.public.supabaseAnonKey as string
  const supabase = createClient(url, anonKey, { auth: { persistSession: false } })

  const authHeader = getHeader(event, 'authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) return null

  const { data: { user } } = await supabase.auth.getUser(token)
  return user
}
