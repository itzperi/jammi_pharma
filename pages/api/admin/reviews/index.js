import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'GET') {
    const { status = 'pending', product_id, page = 1, limit = 20 } = req.query
    let query = supabaseAdmin
      .from('reviews')
      .select('*, products(name, images)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page-1)*limit, page*limit-1)

    if (status !== 'all') query = query.eq('status', status)
    if (product_id) query = query.eq('product_id', product_id)
    
    const { data, count, error } = await query
    if (error) return serverError(res, error)
    return res.status(200).json({ data, total: count })
  }

  return res.status(405).end()
}
