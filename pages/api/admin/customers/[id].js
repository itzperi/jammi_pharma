import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  const { id } = req.query

  if (req.method === 'GET') {
    const { data: user, error: userError } = await supabaseAdmin.from('site_users').select('*').eq('id', id).single()
    if (userError) return serverError(res, userError)

    const { data: orders, error: ordersError } = await supabaseAdmin.from('orders').select('*, order_items(*)').eq('user_id', id).order('created_at', { ascending: false })
    if (ordersError) return serverError(res, ordersError)

    return res.status(200).json({ ...user, orders: orders || [] })
  }

  if (req.method === 'PATCH') {
    const updates = { ...req.body, updated_at: new Date().toISOString() }
    const { error } = await supabaseAdmin.from('site_users').update(updates).eq('id', id)
    if (error) return serverError(res, error)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
