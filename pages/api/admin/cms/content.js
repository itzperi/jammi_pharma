import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('cms_content').select('*').eq('page', req.query.page)
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const updates = req.body.updates
    const { error } = await supabaseAdmin.from('cms_content').upsert(
      updates.map(u => ({
        page: u.page, section: u.section, content_key: u.content_key,
        content_value: String(u.content_value), content_type: u.content_type || 'text',
        updated_at: new Date().toISOString()
      })),
      { onConflict: 'page,section,content_key' }
    )
    if (error) return res.status(500).json({ error: error.message || 'Supabase Error' })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
