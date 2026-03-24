import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('role_permissions').select('*')
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { permissions } = req.body
    const { error } = await supabaseAdmin.from('role_permissions').upsert(permissions, { onConflict: 'role,module' })
    if (error) return serverError(res, error)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
