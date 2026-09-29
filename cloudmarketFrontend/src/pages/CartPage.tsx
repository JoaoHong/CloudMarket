import { Link, useNavigate } from 'react-router';
import { errorMessage } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useCheckout } from '../hooks/useCheckout';
import { cartTotal, useCart } from '../store/cart';
import { formatBRL } from '../utils/format';

export default function CartPage() {
  const { items, setQuantity, remove, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const checkout = useCheckout(clear);

  if (items.length === 0) {
    return (
      <div className="rounded-md bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold">Seu carrinho está vazio</p>
        <Link to="/" className="mt-2 inline-block text-brand hover:underline">
          Descobrir produtos
        </Link>
      </div>
    );
  }

  function proceed() {
    if (!user) {
      navigate('/entrar?next=/carrinho');
      return;
    }
    checkout.mutate(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <section className="divide-y divide-gray-100 rounded-md bg-white shadow-sm">
        <h1 className="p-4 text-lg font-semibold">Carrinho</h1>
        {items.map((i) => (
          <div key={i.productId} className="flex items-center gap-4 p-4">
            <img src={i.imageUrl} alt="" className="h-16 w-16 rounded object-cover" />
            <div className="flex-1">
              <Link to={`/produto/${i.productId}`} className="text-sm hover:text-brand">
                {i.title}
              </Link>
              <button onClick={() => remove(i.productId)} className="block text-xs text-brand hover:underline">
                Excluir
              </button>
            </div>
            <div className="flex items-center rounded border border-gray-300">
              <button className="px-2" onClick={() => setQuantity(i.productId, i.quantity - 1)} aria-label="Diminuir">
                −
              </button>
              <span className="w-8 text-center text-sm">{i.quantity}</span>
              <button className="px-2" onClick={() => setQuantity(i.productId, i.quantity + 1)} aria-label="Aumentar">
                +
              </button>
            </div>
            <p className="w-28 text-right">{formatBRL(i.price * i.quantity)}</p>
          </div>
        ))}
      </section>

      <aside className="h-fit space-y-4 rounded-md bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Resumo da compra</h2>
        <div className="flex justify-between text-lg">
          <span>Total</span>
          <span>{formatBRL(cartTotal(items))}</span>
        </div>
        <button
          onClick={proceed}
          disabled={checkout.isPending}
          className="w-full rounded-md bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {checkout.isPending ? 'Processando…' : 'Continuar a compra'}
        </button>
        {checkout.isError && <p className="text-sm text-red-600">{errorMessage(checkout.error)}</p>}
      </aside>
    </div>
  );
}
