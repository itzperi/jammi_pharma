import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { MOCK_PRODUCTS } from '../../../../constants';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limitCount = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    let dbProducts: any[] = [];
    if (supabaseAdmin) {
        try {
            const { data, error } = await supabaseAdmin.from('products').select('*');
            if (!error && data) {
                dbProducts = data;
            } else {
                console.error("Supabase fetch products error:", error);
            }
        } catch (e) {
            console.error("Error fetching admin products from DB:", e);
        }
    }

    const existingIds = new Set(dbProducts.map(prod => String(prod.id)));
    const missingMockProducts = MOCK_PRODUCTS.filter(prod => !existingIds.has(String(prod.id))).map((prod: any) => ({
        ...prod,
        status: 'Published' // Mock products are considered published
    }));

    let products = [...dbProducts, ...missingMockProducts];

    // Filter out soft-deleted products
    products = products.filter((p: any) => !p.deleted);

    // In-memory Filter & Sort (since Firebase lacks native full-text + multi query support without indexes)
    products.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    if (search) {
        products = products.filter((p: any) => p.name?.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
        products = products.filter((p: any) => p.category === category);
    }
    if (status && status !== 'All') {
        products = products.filter((p: any) => p.status === status);
    }

    const total = products.length;
    const paginated = products.slice((page - 1) * limitCount, page * limitCount);

    return NextResponse.json({
        products: paginated,
        total,
        page,
        limit: limitCount
    });
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        if (!supabaseAdmin) {
            return NextResponse.json({ error: "Database not initialized" }, { status: 503 });
        }
        
        const { data: insertedData, error } = await supabaseAdmin.from('products').insert([{
            ...data
        }]).select('id').single();
        
        if (error) {
            throw new Error(error.message);
        }
        return NextResponse.json({ id: insertedData.id, ...data });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
