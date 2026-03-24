import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  const { id } = req.query

  if (req.method === 'PUT') {
    const { data, error } = await supabaseAdmin.from('coupons').update(req.body).eq('id', id).select().single()
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  if (req.method === 'PATCH') {
    const { status } = req.body
    const updates = status !== undefined ? { status } : req.body
    const { error } = await supabaseAdmin.from('coupons').update(updates).eq('id', id)
    if (error) return serverError(res, error)
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('coupons').delete().eq('id', id)
    if (error) return serverError(res, error)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
