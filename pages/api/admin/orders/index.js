import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'GET') {
    const { search, order_status, payment_status, start_date, end_date, page = 1, limit = 20 } = req.query
    let query = supabaseAdmin
      .from('orders')
      .select('*, site_users(user_code, name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page-1)*limit, page*limit-1)
      
    if (order_status) query = query.eq('order_status', order_status)
    if (payment_status) query = query.eq('payment_status', payment_status)
    if (start_date) query = query.gte('created_at', start_date)
    if (end_date) query = query.lte('created_at', end_date)
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%`)
    }
    const { data, count, error } = await query
    if (error) return serverError(res, error)
    return res.status(200).json({ data, total: count })
  }

  return res.status(405).end()
}
