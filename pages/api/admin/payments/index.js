import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'GET') {
    const { search, status, page = 1, limit = 20 } = req.query
    
    // We pull primarily from orders for now, as it contains the source of truth for payments
    let query = supabaseAdmin
      .from('orders')
      .select('id, order_number, customer_name, total_amount, payment_status, payment_method, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page-1)*limit, page*limit-1)

    if (status && status !== 'all') query = query.eq('payment_status', status)
    if (search) query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%`)
    
    const { data, count, error } = await query
    if (error) return serverError(res, error)
    
    return res.status(200).json({ data, total: count })
  }

  return res.status(405).end()
}
