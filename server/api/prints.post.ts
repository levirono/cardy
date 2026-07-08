import { getSupabaseClient } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('print_requests').insert({
    card_id: body.cardId,
    recipient_name: body.recipientName,
    address_line: body.addressLine,
    wrap_style: body.wrapStyle,
    note: body.note,
  }).select('*').single()
  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})



