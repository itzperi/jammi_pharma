import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../../lib/supabase';
import { rateLimit, getClientIp } from '../../../lib/rateLimit';
import { OrderShippedEmail } from '../../../components/emails/OrderShippedEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  // ── Rate Limiting: 5 requests per minute per IP ───────────────────────────
  const ip = getClientIp(req);
  const { allowed, remaining, resetAt } = rateLimit(`send-shipping-email:${ip}`, 5, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { orderId, courierName, trackingId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // ── Fetch order from Supabase ──────────────────────────────────────────
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('order_number, customer_name, customer_email, items, total, shipping_address')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // ── Normalize items ────────────────────────────────────────────────────
    const items: { name: string; quantity: number; price: number }[] =
      Array.isArray(order.items)
        ? order.items.map((item: any) => ({
            name: item.name || item.productName || 'Product',
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
          }))
        : [];

    const shippingAddress =
      typeof order.shipping_address === 'object'
        ? [
            order.shipping_address.address,
            order.shipping_address.city,
            order.shipping_address.pincode,
          ]
            .filter(Boolean)
            .join(', ')
        : String(order.shipping_address || '');

    // ── Send shipping email to customer ───────────────────────────────────
    const { error: emailError } = await resend.emails.send({
      from: 'Jammi Pharmaceuticals <onboarding@resend.dev>',
      to: [order.customer_email],
      subject: `🎉 Your Jammi order ${order.order_number} is on its way!`,
      react: OrderShippedEmail({
        customerName: order.customer_name,
        orderNumber: order.order_number,
        items,
        total: Number(order.total),
        shippingAddress,
        courierName,
        trackingId,
      }),
    });

    if (emailError) {
      console.error('[send-shipping-email] Resend error:', emailError);
      return NextResponse.json({ error: 'Email send failed', detail: emailError }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: `Shipping email sent to ${order.customer_email}` },
      {
        headers: {
          'X-RateLimit-Remaining': String(remaining),
        },
      }
    );
  } catch (err) {
    console.error('[send-shipping-email] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
