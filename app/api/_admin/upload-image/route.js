import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  const bucket = formData.get('bucket') || 'cms-images'
  const folder = formData.get('folder') || ''

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const fileBuffer = await file.arrayBuffer()
  const fileExt = file.name?.split('.').pop() || 'jpg'
  const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, fileBuffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
