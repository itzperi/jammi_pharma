import { createClient } from '@supabase/supabase-js'

// Server-only admin client — bypasses RLS using service role key
// ONLY import this in /pages/api/* files, NEVER in browser components
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function verifyAdmin(req) {
  try {
    const token = req.headers?.authorization?.replace('Bearer ', '')
    if (!token) return null

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return null

    const { data: adminRecord } = await supabaseAdmin
      .from('admin_users')
      .select('id, name, email, role, status')
      .eq('auth_user_id', user.id)
      .eq('status', 'active')
      .single()

    if (!adminRecord) return null
    return { user, adminRecord }
  } catch {
    return null
  }
}

export function unauthorized(res) {
  return res.status(401).json({ error: 'Unauthorized. Admin session required.' })
}

export function serverError(res, error) {
  console.error('[Jammi Admin API Error]', error)
  return res.status(500).json({ error: error?.message || 'Internal server error' })
}
