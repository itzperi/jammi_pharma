import React from 'react';
import ProductTemplate from './ProductTemplate';
import { Metadata, ResolvingMetadata } from 'next';
import { MOCK_PRODUCTS } from '../../../../constants'; // Keep for metadata generation if needed

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return {
      title: 'Product - Jammi Pharmaceuticals',
    };
  }

  return {
    title: `${product.name} - Jammi Pharmaceuticals`,
    description: product.shortDesc,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  // Passing the ID to the client template where it will fetch the real data from Firebase
  return <ProductTemplate productId={id} />;
}
