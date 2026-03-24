import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'POST') {
    const { url, bucket } = req.body
    if (!url || !bucket) return res.status(400).json({ error: 'Missing url or bucket' })

    const path = url.split(`/storage/v1/object/public/${bucket}/`)[1]
    if (!path) return res.status(400).json({ error: 'Invalid URL format' })

    const { error } = await supabaseAdmin.storage.from(bucket).remove([path])
    if (error) return serverError(res, error)

    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
