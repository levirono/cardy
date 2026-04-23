import type { CardTemplate } from '~/types'

export const useTemplates = () => {
  const { $supabase } = useNuxtApp()

  const fetchActiveTemplates = async (category?: string): Promise<{ data: CardTemplate[]; error: any }> => {
    try {
      let query = $supabase
        .from('card_templates')
        .select(`*, designer:profiles!card_templates_designer_id_fkey(id, full_name, avatar_url)`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (category) query = query.eq('category', category)
      const { data, error } = await query
      if (error) throw error
      return { data: (data as CardTemplate[]) ?? [], error: null }
    } catch (error: any) {
      return { data: [], error }
    }
  }

  const fetchTemplateRatings = async (templateId: string) => {
    try {
      const { data, error } = await $supabase
        .from('card_ratings')
        .select('rating, comment, user:profiles!card_ratings_user_id_fkey(full_name)')
        .eq('template_id', templateId)
        .order('created_at', { ascending: false })
      if (error) throw error
      const avg = data?.length ? data.reduce((s: number, r: any) => s + r.rating, 0) / data.length : 0
      return { data, avg: Math.round(avg * 10) / 10, count: data?.length ?? 0, error: null }
    } catch (error: any) {
      return { data: [], avg: 0, count: 0, error }
    }
  }

  const submitRating = async (templateId: string, rating: number, comment?: string) => {
    try {
      const { user } = useAuth()
      if (!user.value) throw new Error('Not authenticated')
      const { data, error } = await $supabase
        .from('card_ratings')
        .upsert({ template_id: templateId, user_id: user.value.id, rating, comment: comment ?? null })
        .select()
        .single()
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const fetchTopRatedTemplates = async (limit = 3): Promise<CardTemplate[]> => {
    try {
      // Get templates with avg rating from a view or manual aggregation
      const { data } = await $supabase
        .from('card_templates')
        .select(`*, designer:profiles!card_templates_designer_id_fkey(full_name), card_ratings(rating)`)
        .eq('is_active', true)
        .limit(10)
      if (!data) return []
      return (data as any[]).map(t => ({
        ...t,
        avg_rating: t.card_ratings?.length
          ? t.card_ratings.reduce((s: number, r: any) => s + r.rating, 0) / t.card_ratings.length
          : 0,
        rating_count: t.card_ratings?.length ?? 0,
      })).sort((a: any, b: any) => b.avg_rating - a.avg_rating).slice(0, limit)
    } catch {
      return []
    }
  }

  const createTemplate = async (payload: { title: string; description?: string; thumbnail_url?: string; category: string }) => {
    try {
      const { user } = useAuth()
      if (!user.value) throw new Error('Not authenticated')
      const { data, error } = await $supabase
        .from('card_templates')
        .insert({ ...payload, designer_id: user.value.id })
        .select()
        .single()
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  return { fetchActiveTemplates, fetchTemplateRatings, submitRating, fetchTopRatedTemplates, createTemplate }
}
