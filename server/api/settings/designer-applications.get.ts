import { getSupabaseClient } from '../../utils/supabase'

export default defineEventHandler(async () => {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'designer_applications_enabled')
    .maybeSingle()

  if (error) {
    console.error('Error fetching designer applications setting:', error)
    // Fail-open so the feature still works if settings row is missing
    return { enabled: true }
  }

  const enabled = data?.value?.enabled

  return { enabled: enabled !== false }
})

