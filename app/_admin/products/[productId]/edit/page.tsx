"use client";
import { useEffect, useState } from 'react';
import ProductForm from '../../../../../components/admin/ProductForm';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
    const { productId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/admin/products/${productId}`);
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (productId) fetchProduct();
    }, [productId]);

    if(loading) return <div className="p-12 text-center text-slate-500"><div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
    if(!data) return <p className="p-12 text-center">Failed to load product</p>;

    return <ProductForm initialData={data} productId={productId as string} isEdit={true} />;
}
