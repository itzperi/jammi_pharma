import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('admin_users').select('*').order('created_at')
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { email, password, name, role } = req.body
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })
    if (authError) return serverError(res, authError)

    const { data, error } = await supabaseAdmin.from('admin_users').insert({
      auth_user_id: authUser.user.id, name, email, role
    }).select().single()
    if (error) return serverError(res, error)

    return res.status(201).json(data)
  }

  return res.status(405).end()
}
