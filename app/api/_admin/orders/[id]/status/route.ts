import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, supabaseAdmin, unauthorized, serverError } from '@/lib/adminAuth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await verifyAdmin(req);
  if (!admin) return unauthorized();

  try {
    const { id } = params;
    const body = await req.json();
    const { order_status, payment_status, tracking_number, courier_name, admin_notes } = body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (order_status) updates.order_status = order_status;
    if (payment_status) updates.payment_status = payment_status;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;
    if (courier_name !== undefined) updates.courier_name = courier_name;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return serverError(error);
    return NextResponse.json({ data });
  } catch (error) {
    return serverError(error);
  }
}
