import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)
  
  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*), site_users(user_code, name, email, phone)')
      .eq('id', id)
      .single()
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  if (req.method === 'PUT') {
    const { order_status, payment_status } = req.body
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        order_status, 
        payment_status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }
  
  return res.status(405).end()
}
