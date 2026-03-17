import { supabaseAdmin } from './supabase';

export async function generateCustomerId(): Promise<string> {
  const { data } = await supabaseAdmin
    .from('customers')
    .select('id')
    .like('id', 'customer-%')
    .order('joined_at', { ascending: false })
    .limit(1);

  if (!data || data.length === 0) return 'customer-01';

  const last = data[0].id; // e.g. "customer-07"
  const num = parseInt(last.replace('customer-', ''), 10);
  return `customer-${String(num + 1).padStart(2, '0')}`;
}
