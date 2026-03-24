import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)
  const { key } = req.query
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('cms_static_pages').select('*').eq('page_key', key).single()
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }
  if (req.method === 'PUT') {
    const { content } = req.body
    const { data, error } = await supabaseAdmin.from('cms_static_pages').update({ content, updated_at: new Date().toISOString() }).eq('page_key', key).select().single()
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }
  return res.status(405).end()
}
