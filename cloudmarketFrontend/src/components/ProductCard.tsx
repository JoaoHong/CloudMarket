import { Link } from 'react-router';
import type { ProductCard as ProductCardType } from '../types';
import Price from './Price';

export default function ProductCard({ product }: { product: ProductCardType }) {
  return (
    <Link
      to={`/produto/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-md bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden border-b border-gray-100 bg-white">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <Price
          price={product.price}
          originalPrice={product.originalPrice}
          discountPercent={product.discountPercent}
          installments={product.installments}
        />
        {product.freeShipping && <p className="text-sm font-semibold text-success">Frete grátis</p>}
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{product.title}</p>
      </div>
    </Link>
  );
}
