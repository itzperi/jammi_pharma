import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  const { id } = req.query

  if (req.method === 'PUT') {
    const { data, error } = await supabaseAdmin.from('categories').update({...req.body, updated_at: new Date().toISOString()}).eq('id', id).select().single()
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { count, error: countError } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('category_id', id)
    if (countError) return serverError(res, countError)
    
    if (count > 0) {
      return res.status(400).json({ error: 'Cannot delete category with assigned products' })
    }

    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id)
    if (error) return serverError(res, error)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
