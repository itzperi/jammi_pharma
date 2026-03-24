import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  const { id } = req.query

  if (req.method === 'PUT') {
    const { product_ids = [], ...bundleData } = req.body
    bundleData.updated_at = new Date().toISOString()
    
    const { data: bundle, error } = await supabaseAdmin.from('bundles').update(bundleData).eq('id', id).select().single()
    if (error) return serverError(res, error)

    await supabaseAdmin.from('bundle_products').delete().eq('bundle_id', id)
    if (product_ids.length > 0) {
      const bProducts = product_ids.map(pid => ({ bundle_id: id, product_id: pid }))
      await supabaseAdmin.from('bundle_products').insert(bProducts)
    }

    return res.status(200).json(bundle)
  }

  if (req.method === 'DELETE') {
    await supabaseAdmin.from('bundle_products').delete().eq('bundle_id', id)
    const { error } = await supabaseAdmin.from('bundles').delete().eq('id', id)
    if (error) return serverError(res, error)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
