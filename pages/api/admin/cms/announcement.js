import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('cms_announcement').select('*').single()
    if (error) return res.status(200).json(null)
    return res.status(200).json(data)
  }
  if (req.method === 'PUT') {
    const { data, error } = await supabaseAdmin.from('cms_announcement').upsert({ id: 1, ...req.body, updated_at: new Date().toISOString() }).select().single()
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }
  return res.status(405).end()
}
