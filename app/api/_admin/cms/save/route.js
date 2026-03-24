import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'No auth token' }, { status: 401 })

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

  const { data: adminUser } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .eq('auth_user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!adminUser) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const { updates } = await request.json()

  const { error } = await supabaseAdmin
    .from('cms_content')
    .upsert(
      updates.map((u) => ({
        page: u.page,
        section: u.section,
        content_key: u.content_key,
        content_value: u.content_value,
        content_type: u.content_type || 'text',
        updated_at: new Date().toISOString()
      })),
      { onConflict: 'page,section,content_key' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
