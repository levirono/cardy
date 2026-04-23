import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey

  // Debug logging
  console.log('Supabase config check:', {
    supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
    supabaseAnonKey: supabaseAnonKey ? 'SET' : 'MISSING',
    fullConfig: config.public
  })

  // Graceful handling for missing environment variables
  if (!supabaseUrl) {
    console.error('SUPABASE_URL is missing from environment variables')
    console.error('Please ensure your .env file contains: SUPABASE_URL=your_supabase_url')
    // Don't throw error in development to allow app to load
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Supabase URL is not configured')
    }
    return {
      provide: {
        supabase: null as any,
      },
    }
  }
  
  if (!supabaseAnonKey) {
    console.error('SUPABASE_ANON_KEY is missing from environment variables')
    console.error('Please ensure your .env file contains: SUPABASE_ANON_KEY=your_supabase_anon_key')
    // Don't throw error in development to allow app to load
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Supabase anonymous key is not configured')
    }
    return {
      provide: {
        supabase: null as any,
      },
    }
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    console.error('Invalid SUPABASE_URL format:', supabaseUrl)
    console.error('SUPABASE_URL should be a valid URL like: https://your-project.supabase.co')
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid Supabase URL format')
    }
    return {
      provide: {
        supabase: null as any,
      },
    }
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'Connection': 'keep-alive'
      }
    },
    db: {
      schema: 'public'
    },
    // Add timeout configuration to prevent 504 errors
    realtime: {
      timeout: 30000
    }
  })

  return {
    provide: {
      supabase,
    },
  }
})