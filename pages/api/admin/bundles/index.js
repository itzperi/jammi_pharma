import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('bundles')
      .select('*, bundle_products(product_id, products(id,name,images,price))')
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { product_ids = [], ...bundleData } = req.body
    const { data: bundle, error } = await supabaseAdmin.from('bundles').insert(bundleData).select().single()
    if (error) return serverError(res, error)

    if (product_ids.length > 0) {
      const bProducts = product_ids.map(pid => ({ bundle_id: bundle.id, product_id: pid }))
      await supabaseAdmin.from('bundle_products').insert(bProducts)
    }

    return res.status(201).json(bundle)
  }

  return res.status(405).end()
}
