import type { Wedding, WeddingRsvp, WeddingWish } from '~/types'

const generateSlug = (name1: string, name2: string): string => {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  const rand = Math.random().toString(36).substring(2, 7)
  return `${clean(name1)}-and-${clean(name2)}-${rand}`
}

export const useWeddings = () => {
  const { $supabase } = useNuxtApp()

  const createWedding = async (payload: Omit<Wedding, 'id' | 'user_id' | 'slug' | 'created_at' | 'updated_at'>) => {
    try {
      const { user } = useAuth()
      if (!user.value) throw new Error('Not authenticated')
      const slug = generateSlug(payload.couple_name_1, payload.couple_name_2)
      const { data, error } = await $supabase
        .from('weddings')
        .insert({ ...payload, user_id: user.value.id, slug })
        .select()
        .single()
      if (error) throw error
      return { data: data as Wedding, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const updateWedding = async (id: string, payload: Partial<Wedding>) => {
    try {
      const { data, error } = await $supabase
        .from('weddings')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return { data: data as Wedding, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const deleteWedding = async (id: string) => {
    try {
      const { error } = await $supabase.from('weddings').delete().eq('id', id)
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const fetchMyWeddings = async (): Promise<{ data: Wedding[]; error: any }> => {
    try {
      const { user } = useAuth()
      if (!user.value) return { data: [], error: null }
      const { data, error } = await $supabase
        .from('weddings')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return { data: (data as Wedding[]) ?? [], error: null }
    } catch (error: any) {
      return { data: [], error }
    }
  }

  const fetchWeddingBySlug = async (slug: string): Promise<{ data: Wedding | null; error: any }> => {
    try {
      const { data, error } = await $supabase
        .from('weddings')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error) throw error
      return { data: data as Wedding, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const submitRsvp = async (weddingId: string, payload: Omit<WeddingRsvp, 'id' | 'wedding_id' | 'created_at'>) => {
    try {
      const { data, error } = await $supabase
        .from('wedding_rsvps')
        .insert({ ...payload, wedding_id: weddingId })
        .select()
        .single()
      if (error) throw error
      return { data: data as WeddingRsvp, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const fetchWishes = async (weddingId: string): Promise<{ data: WeddingWish[]; error: any }> => {
    try {
      const { data, error } = await $supabase
        .from('wedding_wishes')
        .select('*')
        .eq('wedding_id', weddingId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return { data: (data as WeddingWish[]) ?? [], error: null }
    } catch (error: any) {
      return { data: [], error }
    }
  }

  const submitWish = async (weddingId: string, guestName: string, wishMessage: string) => {
    try {
      const { data, error } = await $supabase
        .from('wedding_wishes')
        .insert({ wedding_id: weddingId, guest_name: guestName, wish_message: wishMessage })
        .select()
        .single()
      if (error) throw error
      return { data: data as WeddingWish, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const fetchRsvpStats = async (weddingId: string) => {
    try {
      const { data, error } = await $supabase
        .from('wedding_rsvps')
        .select('attendance_status')
        .eq('wedding_id', weddingId)
      if (error) throw error
      const attending = data?.filter((r: any) => r.attendance_status === 'attending').length ?? 0
      const notAttending = data?.filter((r: any) => r.attendance_status === 'not_attending').length ?? 0
      const maybe = data?.filter((r: any) => r.attendance_status === 'maybe').length ?? 0
      return { attending, notAttending, maybe, total: (data?.length ?? 0), error: null }
    } catch (error: any) {
      return { attending: 0, notAttending: 0, maybe: 0, total: 0, error }
    }
  }

  return { createWedding, updateWedding, deleteWedding, fetchMyWeddings, fetchWeddingBySlug, submitRsvp, fetchWishes, submitWish, fetchRsvpStats }
}
