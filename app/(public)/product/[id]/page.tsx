import React from 'react';
import ProductTemplate from './ProductTemplate';
import { Metadata, ResolvingMetadata } from 'next';
import { MOCK_PRODUCTS } from '../../../../constants';
import { supabaseAdmin } from '../../../../lib/adminAuth';

type Props = {
  params: Promise<{ id: string }>
}

async function getProduct(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error || !data) {
    // Fallback to MOCK_PRODUCTS for now if not found in DB
    return MOCK_PRODUCTS.find(p => p.id === slug) || null;
  }
  
  return data;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product - Jammi Pharmaceuticals',
    };
  }

  return {
    title: `${product.name} - Jammi Pharmaceuticals`,
    description: product.description || product.shortDesc,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const initialProduct = await getProduct(id);
  
  return <ProductTemplate productId={id} initialData={initialProduct} />;
}

