import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router';
import { bffApi } from '../api/endpoints';
import { errorMessage } from '../api/client';
import Price from '../components/Price';
import ProductShelf from '../components/ProductShelf';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';
import { useAuth } from '../hooks/useAuth';
import { useCheckout } from '../hooks/useCheckout';
import { useCart } from '../store/cart';

export default function ProductPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const addToCart = useCart((s) => s.add);
  const checkout = useCheckout();
  const [quantity, setQuantity] = useState(1);

  // Produto + vendedor + relacionados + parcelamento: tudo numa chamada ao BFF
  const { data: p, isLoading, error, refetch } = useQuery({
    queryKey: ['bff', 'product', id],
    queryFn: () => bffApi.product(id),
  });

  if (isLoading) return <Spinner />;
  if (error || !p) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const cartItem = { productId: p.id, title: p.title, imageUrl: p.imageUrl, price: p.price, stock: p.stock };

  function buyNow() {
    if (!user) {
      navigate(`/entrar?next=${encodeURIComponent(`/produto/${id}`)}`);
      return;
    }
    checkout.mutate([{ productId: p!.id, quantity }]);
  }

  return (
    <div className="space-y-8">
      <nav className="text-sm text-gray-500">
        <Link to={`/busca?category=${p.category.slug}`} className="text-brand hover:underline">
          {p.category.name}
        </Link>
      </nav>

      <div className="grid gap-6 rounded-md bg-white p-6 shadow-sm md:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <img src={p.imageUrl} alt={p.title} className="mx-auto max-h-[480px] rounded object-contain" />
          <div>
            <h2 className="mb-2 text-xl font-semibold">Descrição</h2>
            <p className="whitespace-pre-line text-gray-600">{p.description}</p>
          </div>
        </div>

        <aside className="space-y-4 rounded-md border border-gray-200 p-5">
          <p className="text-xs text-gray-500">
            {p.condition === 'NEW' ? 'Novo' : 'Usado'} | +{p.soldCount} vendidos
            {p.rating != null && ` | ★ ${p.rating}`}
          </p>
          <h1 className="text-xl font-semibold">{p.title}</h1>
          <Price
            size="lg"
            price={p.price}
            originalPrice={p.originalPrice}
            discountPercent={p.discountPercent}
            installments={p.installments}
          />
          {p.freeShipping && <p className="font-semibold text-success">Frete grátis</p>}

          {p.stock > 0 ? (
            <>
              <label className="block text-sm">
                Quantidade:{' '}
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="rounded border border-gray-300 px-2 py-1"
                >
                  {Array.from({ length: Math.min(p.stock, 10) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'unidade' : 'unidades'}
                    </option>
                  ))}
                </select>
                <span className="ml-2 text-gray-400">({p.stock} disponíveis)</span>
              </label>

              <button
                onClick={buyNow}
                disabled={checkout.isPending}
                className="w-full rounded-md bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
              >
                {checkout.isPending ? 'Processando…' : 'Comprar agora'}
              </button>
              <button
                onClick={() => {
                  addToCart(cartItem, quantity);
                  navigate('/carrinho');
                }}
                className="w-full rounded-md bg-brand-light py-3 font-semibold text-brand hover:brightness-95"
              >
                Adicionar ao carrinho
              </button>
              {checkout.isError && <p className="text-sm text-red-600">{errorMessage(checkout.error)}</p>}
            </>
          ) : (
            <p className="font-semibold text-red-600">Produto esgotado</p>
          )}

          <div className="border-t border-gray-200 pt-4 text-sm">
            <p className="text-gray-500">Vendido por</p>
            <p className="font-semibold">{p.seller.name}</p>
            <p className="text-gray-500">{p.seller.activeListings} anúncios ativos</p>
          </div>
        </aside>
      </div>

      <ProductShelf title="Quem viu este produto também comprou" products={p.related} />
    </div>
  );
}
