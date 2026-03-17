
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    label: string;
    shortDesc: string;
    price: number;
    image: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  return (
    <div className="group cursor-pointer" onClick={() => router.push(`/product/${product.id}`)}>
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white mb-6 border border-primary/5 shadow-sm group-hover:shadow-md transition-all duration-500">
        <Image
          alt={product.name}
          src={product.image}
          width={400}
          height={533}
          className="w-full h-full object-contain p-8 mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/10">
          {product.label}
        </div>
      </div>
      <h4 className="font-sans font-bold text-2xl mb-2 group-hover:text-primary transition-colors text-slate-900">{product.name}</h4>
      <p className="text-slate-500 text-sm mb-4 font-dm line-clamp-2">{product.shortDesc}</p>
      <div className="flex items-center justify-between border-t border-primary/10 pt-4">
        <span className="text-xl font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
        <button
          className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            router.push('/checkout');
          }}
        >
          Quick Add <span className="material-symbols-outlined text-sm">add</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
