import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('products').select('*, categories(name), product_variants(*)').eq('id', id).single()
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  if (req.method === 'PUT') {
    // Sanitize req.body to remove nested objects (categories, variants) that aren't columns
    const { categories, product_variants, ...updateData } = req.body
    
    const { data, error } = await supabaseAdmin.from('products')
      .update({
        ...updateData, 
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    if (error) return serverError(res, error)
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { data: product } = await supabaseAdmin.from('products').select('images').eq('id', id).single()
    if (product?.images?.length > 0) {
      const paths = product.images.map(url => url.split('/storage/v1/object/public/product-images/')[1]).filter(Boolean)
      if (paths.length > 0) {
        await supabaseAdmin.storage.from('product-images').remove(paths)
      }
    }
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
    if (error) return serverError(res, error)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
