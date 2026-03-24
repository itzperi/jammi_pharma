import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'GET') {
    const { search, status, page = 1, limit = 20 } = req.query
    let query = supabaseAdmin
      .from('site_users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page-1)*limit, page*limit-1)

    if (status) query = query.eq('status', status)
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,user_code.ilike.%${search}%`)
    
    const { data: users, count, error } = await query
    if (error) return serverError(res, error)

    const enriched = await Promise.all(users.map(async (u) => {
      const { count: order_count } = await supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('user_id', u.id)
      return { ...u, order_count: order_count || 0 }
    }))
    
    return res.status(200).json({ data: enriched, total: count })
  }

  return res.status(405).end()
}
