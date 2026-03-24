import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('inventory_log')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  return res.status(405).end()
}
