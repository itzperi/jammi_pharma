import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  const { id } = req.query

  if (req.method === 'PATCH') {
    const { stock, low_stock_threshold, reason } = req.body
    
    // Get current stock
    const { data: product, error: fetchError } = await supabaseAdmin.from('products').select('stock').eq('id', id).single()
    if (fetchError) return serverError(res, fetchError)

    const previous_stock = product.stock
    const new_stock = stock !== undefined ? stock : previous_stock
    const change_amount = new_stock - previous_stock

    const updates = { updated_at: new Date().toISOString() }
    if (stock !== undefined) updates.stock = stock
    if (low_stock_threshold !== undefined) updates.low_stock_threshold = low_stock_threshold

    const { error: updateError } = await supabaseAdmin.from('products').update(updates).eq('id', id)
    if (updateError) return serverError(res, updateError)

    if (stock !== undefined && change_amount !== 0) {
      await supabaseAdmin.from('inventory_log').insert({
        product_id: id,
        previous_stock,
        new_stock,
        change_amount,
        reason: reason || 'Manual adjustment',
        changed_by: admin.adminRecord.id
      })
    }

    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
