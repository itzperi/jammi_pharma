import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)
  const { id } = req.query

  if (req.method === 'PUT') {
    const { data, error } = await supabaseAdmin.from('cms_banners').update(req.body).eq('id', id).select().single()
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('cms_banners').delete().eq('id', id)
    if (error) return serverError(res, error)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
