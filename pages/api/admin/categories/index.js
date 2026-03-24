import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*, products(count)')
      .order('display_order', { ascending: true })
    if (error) return res.status(500).json({ error: error.message, data: [] })
    
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { data, error } = await supabaseAdmin.from('categories').insert(req.body).select().single()
    if (error) return serverError(res, error)
    return res.status(201).json(data)
  }

  return res.status(405).end()
}
