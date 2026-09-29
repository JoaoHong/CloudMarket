import type { ProductCard as ProductCardType } from '../types';
import ProductCard from './ProductCard';

export default function ProductShelf({ title, products }: { title: string; products: ProductCardType[] }) {
  if (products.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
