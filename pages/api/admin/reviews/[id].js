import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  const { id } = req.query

  if (req.method === 'PATCH') {
    const { status } = req.body
    const { error } = await supabaseAdmin.from('reviews').update({ status }).eq('id', id)
    if (error) return serverError(res, error)
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id)
    if (error) return serverError(res, error)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
