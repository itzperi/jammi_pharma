export const config = { api: { bodyParser: false } }
import formidable from 'formidable'
import fs from 'fs'
import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req)
  if (!admin) return unauthorized(res)

  if (req.method === 'POST') {
    const form = formidable({ keepExtensions: true })
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ error: 'Failed to parse form' })
          return resolve()
        }
        try {
          const file = Array.isArray(files.file) ? files.file[0] : files.file
          const bucket = Array.isArray(fields.bucket) ? fields.bucket[0] : fields.bucket || 'cms-images'
          const folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder || ''
          
          if (!file) {
            res.status(400).json({ error: 'No file uploaded' })
            return resolve()
          }

          const buffer = fs.readFileSync(file.filepath)
          const ext = file.originalFilename.split('.').pop()
          const fileName = `${folder ? folder+'/' : ''}${Date.now()}-${Math.floor(Math.random()*10000)}.${ext}`

          const { data, error } = await supabaseAdmin.storage.from(bucket).upload(fileName, buffer, { contentType: file.mimetype })
          if (error) throw error

          const { data: publicUrlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path)
          res.status(200).json({ url: publicUrlData.publicUrl, path: data.path })
          resolve()
        } catch (e) {
          res.status(500).json({ error: e.message })
          resolve()
        }
      })
    })
  }

  return res.status(405).end()
}
