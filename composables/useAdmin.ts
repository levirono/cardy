import type { Profile, DesignerApplication, DesignRequest, AppSetting } from '~/types'

export const useAdmin = () => {
  const { $supabase } = useNuxtApp()

  const fetchAllUsers = async (): Promise<{ data: Profile[]; error: any }> => {
    try {
      const { data, error } = await $supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return { data: (data as Profile[]) ?? [], error: null }
    } catch (error: any) {
      return { data: [], error }
    }
  }

  const updateUserRole = async (userId: string, role: 'user' | 'designer' | 'admin') => {
    try {
      const { data, error } = await $supabase
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const fetchAllApplications = async (): Promise<{ data: DesignerApplication[]; error: any }> => {
    try {
      const { data, error } = await $supabase
        .from('designer_applications')
        .select('*, user:profiles!designer_applications_user_id_fkey(id, full_name, email)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return { data: (data as DesignerApplication[]) ?? [], error: null }
    } catch (error: any) {
      return { data: [], error }
    }
  }

  const decideApplication = async (appId: string, userId: string, decision: 'approved' | 'rejected') => {
    try {
      const { error: appError } = await $supabase
        .from('designer_applications')
        .update({ status: decision, decided_at: new Date().toISOString() })
        .eq('id', appId)
      if (appError) throw appError

      if (decision === 'approved') {
        const { error: roleError } = await $supabase
          .from('profiles')
          .update({ role: 'designer', updated_at: new Date().toISOString() })
          .eq('id', userId)
        if (roleError) throw roleError
      }
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const fetchAllRequests = async (): Promise<{ data: DesignRequest[]; error: any }> => {
    try {
      const { data, error } = await $supabase
        .from('design_requests')
        .select('*, user:profiles!design_requests_user_id_fkey(full_name, email), designer:profiles!design_requests_designer_id_fkey(full_name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return { data: (data as DesignRequest[]) ?? [], error: null }
    } catch (error: any) {
      return { data: [], error }
    }
  }

  const fetchSettings = async (): Promise<{ data: AppSetting[]; error: any }> => {
    try {
      const { data, error } = await $supabase.from('app_settings').select('*')
      if (error) throw error
      return { data: (data as AppSetting[]) ?? [], error: null }
    } catch (error: any) {
      return { data: [], error }
    }
  }

  const updateSetting = async (key: string, value: Record<string, unknown>) => {
    try {
      const { data, error } = await $supabase
        .from('app_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() })
        .select()
        .single()
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const fetchStats = async () => {
    try {
      const [users, cards, weddings, applications] = await Promise.all([
        $supabase.from('profiles').select('id', { count: 'exact', head: true }),
        $supabase.from('cards').select('id', { count: 'exact', head: true }),
        $supabase.from('weddings').select('id', { count: 'exact', head: true }),
        $supabase.from('designer_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ])
      return {
        users: users.count ?? 0,
        cards: cards.count ?? 0,
        weddings: weddings.count ?? 0,
        pendingApplications: applications.count ?? 0,
        error: null,
      }
    } catch (error: any) {
      return { users: 0, cards: 0, weddings: 0, pendingApplications: 0, error }
    }
  }

  return { fetchAllUsers, updateUserRole, fetchAllApplications, decideApplication, fetchAllRequests, fetchSettings, updateSetting, fetchStats }
}
