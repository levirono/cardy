import { getSupabaseAdmin } from '../utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('valentines').insert({
    sender_name: body.sender,
    recipient: body.recipient,
    message: body.message,
  }).select('*').single()
  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})
