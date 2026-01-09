import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  role: 'user' | 'designer'
  created_at: string
  updated_at: string
}

export const useAuth = () => {
  const { $supabase } = useNuxtApp()
  const user = useState<User | null>('auth_user', () => null)
  const profile = useState<UserProfile | null>('auth_profile', () => null)
  const loading = useState<boolean>('auth_loading', () => true)

  // Initialize auth state
  const initAuth = async () => {
    try {
      loading.value = true
      const { data: { session } } = await $supabase.auth.getSession()
      user.value = session?.user ?? null

      if (session?.user) {
        await fetchProfile()
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user.value) return

    try {
      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000))

      const { data, error } = await $supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        profile.value = null
        return
      }

      // If profile doesn't exist, create it directly (RLS allows users to insert their own profile)
      if (!data) {
        try {
          // Prepare profile data
          const newProfileData: UserProfile = {
            id: user.value.id,
            email: user.value.email || null,
            full_name: user.value.user_metadata?.full_name || null,
            role: (user.value.user_metadata?.role as 'user' | 'designer') || 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          const { data: createdProfile, error: createError } = await $supabase
            .from('profiles')
            .insert(newProfileData)
            .select()
            .single()

          if (createError) throw createError

          profile.value = createdProfile
        } catch (createError: any) {
          console.error('Error creating profile:', createError)
          // Use metadata as fallback until profile is created
          profile.value = {
            id: user.value.id,
            email: user.value.email || null,
            full_name: user.value.user_metadata?.full_name || null,
            role: (user.value.user_metadata?.role as 'user' | 'designer') || 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      } else {
        profile.value = data
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Use metadata as fallback
      if (user.value) {
        profile.value = {
          id: user.value.id,
          email: user.value.email || null,
          full_name: user.value.user_metadata?.full_name || null,
          role: (user.value.user_metadata?.role as 'user' | 'designer') || 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      } else {
        profile.value = null
      }
    }
  }

  // Sign up
  const signUp = async (email: string, password: string, fullName: string, role: 'user' | 'designer' = 'user') => {
    try {
      const { data, error } = await $supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      })

      if (error) throw error

      user.value = data.user
      // If sign-up created an active session (no email confirmation required), fetch/create profile
      const sessionToken = (data as any).session?.access_token
      if (sessionToken) {
        // Wait a bit for the trigger to create the profile, then fetch it
        await new Promise(resolve => setTimeout(resolve, 500))
        await fetchProfile()
      }

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await $supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign-in failed:', error)
        throw error
      }

      user.value = data.user
      await fetchProfile()

      return { data, error: null }
    } catch (error: any) {
      console.error('Error in signIn:', error)
      return { data: null, error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await $supabase.auth.signOut()
      if (error) throw error

      user.value = null
      profile.value = null

      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!user.value)

  // Check if user is designer
  const isDesigner = computed(() => profile.value?.role === 'designer')

  // Check if user is regular user
  const isUser = computed(() => profile.value?.role === 'user' || !profile.value)

  // Initialize on mount
  if (process.client) {
    initAuth()

    // Listen for auth changes
    $supabase.auth.onAuthStateChange(async (event, session) => {
      user.value = session?.user ?? null
      if (session?.user) {
        await fetchProfile()
      } else {
        profile.value = null
      }
      loading.value = false
    })
  }

  return {
    user: readonly(user),
    profile: readonly(profile),
    loading: readonly(loading),
    isAuthenticated,
    isDesigner,
    isUser,
    signUp,
    signIn,
    signOut,
    fetchProfile,
    initAuth
  }
}

