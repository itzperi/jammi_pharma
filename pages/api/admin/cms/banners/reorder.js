import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'POST') {
    const { ids = [] } = req.body
    await Promise.all(ids.map((id, index) => 
      supabaseAdmin.from('cms_banners').update({ display_order: index }).eq('id', id)
    ))
    return res.status(200).json({ success: true })
  }
  return res.status(405).end()
}
