import type { User } from '@supabase/supabase-js'
import type { Profile } from '~/types'

export const useAuth = () => {
  const { $supabase } = useNuxtApp()
  const user = useState<User | null>('auth_user', () => null)
  const profile = useState<Profile | null>('auth_profile', () => null)
  const loading = useState<boolean>('auth_loading', () => true)

  if (!$supabase) {
    console.error('Supabase client is not available')
    const noOp = async () => ({ data: null, error: new Error('Supabase not configured') })
    return {
      user: readonly(user), profile: readonly(profile), loading: readonly(loading),
      isAuthenticated: computed(() => false),
      isDesigner: computed(() => false),
      isAdmin: computed(() => false),
      isUser: computed(() => true),
      signUp: noOp, signIn: noOp,
      signOut: async () => ({ error: new Error('Supabase not configured') }),
      fetchProfile: async () => {}, initAuth: async () => {},
    }
  }

  const fetchProfile = async () => {
    if (!user.value) return
    try {
      const { data, error } = await $supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error

      if (!data) {
        // Create profile if it doesn't exist (trigger may have missed it)
        const newProfile: Omit<Profile, 'updated_at'> & { updated_at?: string } = {
          id: user.value.id,
          email: user.value.email ?? null,
          full_name: user.value.user_metadata?.full_name ?? null,
          role: 'user',
          created_at: new Date().toISOString(),
        }
        const { data: created } = await $supabase.from('profiles').insert(newProfile).select().single()
        profile.value = created ?? null
      } else {
        profile.value = data as Profile
      }
    } catch (e) {
      console.error('fetchProfile error:', e)
      if (user.value) {
        profile.value = {
          id: user.value.id,
          email: user.value.email ?? null,
          full_name: user.value.user_metadata?.full_name ?? null,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    }
  }

  const initAuth = async () => {
    try {
      loading.value = true
      const { data: { session } } = await $supabase.auth.getSession()
      user.value = session?.user ?? null
      if (session?.user) await fetchProfile()
    } catch (e) {
      console.error('initAuth error:', e)
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Add timeout and retry logic for signup
      const signupPromise = $supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      
      // Add timeout wrapper
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signup request timed out')), 25000)
      )
      
      const { data, error } = await Promise.race([signupPromise, timeoutPromise]) as any
      
      if (error) throw error
      user.value = data.user
      if (data.session) await fetchProfile()
      return { data, error: null }
    } catch (error: any) {
      console.error('Signup error:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await $supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      user.value = data.user
      await fetchProfile()
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

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

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isDesigner = computed(() => profile.value?.role === 'designer' || profile.value?.role === 'admin')
  const isUser = computed(() => !profile.value || profile.value?.role === 'user')

  // Default redirect path after login based on role
  const defaultRedirect = computed(() => {
    if (isAdmin.value) return '/admin'
    if (profile.value?.role === 'designer') return '/designer'
    return '/dashboard'
  })

  if (process.client) {
    initAuth()
    $supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
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
    isAdmin,
    isDesigner,
    isUser,
    defaultRedirect,
    signUp,
    signIn,
    signOut,
    fetchProfile,
    initAuth,
  }
}
