import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)
  
  const { id } = req.query

  if (req.method === 'PATCH') {
    const { order_status, payment_status, tracking_number, courier_name, admin_notes } = req.body
    const updates = { updated_at: new Date().toISOString() }
    if (order_status !== undefined) updates.order_status = order_status
    if (payment_status !== undefined) updates.payment_status = payment_status
    if (tracking_number !== undefined) updates.tracking_number = tracking_number
    if (courier_name !== undefined) updates.courier_name = courier_name
    if (admin_notes !== undefined) updates.admin_notes = admin_notes

    const { data, error } = await supabaseAdmin.from('orders').update(updates).eq('id', id).select().single()
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  return res.status(405).end()
}
