import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { MOCK_PRODUCTS } from '../../../../../constants';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        let exists = false;
        let data = null;
        let snapshotId = id;

        if (supabaseAdmin) {
            try {
                const { data: dbData, error } = await supabaseAdmin.from('products').select('*').eq('id', id).single();
                if (!error && dbData) {
                    exists = true;
                    data = dbData;
                    snapshotId = dbData.id;
                }
            } catch (e) {
                console.error("Error fetching product from DB:", e);
            }
        }

        if(!exists) {
            // Check mock products if not in DB
            const mockProduct = MOCK_PRODUCTS.find(p => String(p.id) === id);
            if (mockProduct) {
                return NextResponse.json({ ...mockProduct, status: 'Published' });
            }
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json({ id: snapshotId, ...data });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();
        if (!supabaseAdmin) {
            return NextResponse.json({ error: "Database not initialized" }, { status: 503 });
        }
        
        // Use upsert to allow editing mock products (saving them to DB)
        const { error } = await supabaseAdmin.from('products').upsert({
            id: id,
            ...data,
            updated_at: new Date().toISOString()
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        return NextResponse.json({ success: true });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!supabaseAdmin) {
            return NextResponse.json({ error: "Database not initialized" }, { status: 503 });
        }
        
        // Soft delete to handle overriding mock products
        const { error } = await supabaseAdmin.from('products').upsert({
            id: id,
            active: false
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        return NextResponse.json({ success: true });
    } catch(err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
