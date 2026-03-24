import { supabase } from './supabase';

export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  // Verify this user is actually an admin
  const { data: adminRecord } = await supabase
    .from('admin_users')
    .select('id, name, role')
    .eq('auth_user_id', data.user?.id)
    .eq('status', 'active')
    .single();

  if (!adminRecord) {
    await supabase.auth.signOut();
    throw new Error('This account is not an admin.');
  }

  // Store for UI use
  if (typeof window !== 'undefined') {
    localStorage.setItem('jammi_admin_session', 'true');
    localStorage.setItem('jammi_admin_role', adminRecord.role);
  }

  return { session: data.session, adminRecord };
}

export async function adminLogout() {
  await supabase.auth.signOut();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jammi_admin_session');
    localStorage.removeItem('jammi_admin_role');
  }
}

export async function checkAdminSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: adminRecord } = await supabase
    .from('admin_users')
    .select('id, name, role, email')
    .eq('auth_user_id', session.user?.id)
    .eq('status', 'active')
    .single();

  return adminRecord || null;
}
