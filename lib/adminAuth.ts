import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { supabaseAdmin as sharedAdmin } from './supabase'

// Re-export the centralized admin client
export const supabaseAdmin: SupabaseClient = sharedAdmin;

export async function verifyAdmin(req: Request | any) {
  try {
    // Handle both Request (App Router) and incoming message (Pages Router)
    const headers = req.headers instanceof Headers ? req.headers : new Headers(req.headers);
    const token = headers.get('authorization')?.replace('Bearer ', '')
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
  } catch (err) {
    console.error('[verifyAdmin] error:', err);
    return null
  }
}

/**
 * Common unauthorized response helper.
 * Supports both Pages Router (passing 'res') and App Router (returning NextResponse).
 */
export function unauthorized(res?: any) {
  const message = { error: 'Unauthorized. Admin session required.' };
  if (res && typeof res.status === 'function') {
    return res.status(401).json(message);
  }
  return NextResponse.json(message, { status: 401 });
}

/**
 * Common server error response helper.
 * Supports both Pages Router (passing 'res') and App Router (returning NextResponse).
 */
export function serverError(resOrError: any, error?: any) {
  // If only one argument is provided, treat it as the error for App Router
  const err = error || resOrError;
  const res = error ? resOrError : null;

  console.error('[Jammi Admin API Error]', err);
  const message = { error: err?.message || 'Internal server error' };

  if (res && typeof res.status === 'function') {
    return res.status(500).json(message);
  }
  return NextResponse.json(message, { status: 500 });
}
