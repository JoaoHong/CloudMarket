import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { fakePaymentApi, orderApi } from '../api/endpoints';
import { errorMessage } from '../api/client';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';
import { formatBRL } from '../utils/format';

const TEST_CARDS = [
  { number: '4111 1111 1111 1111', result: 'aprovado' },
  { number: '4000 0000 0000 0002', result: 'recusado' },
];

/**
 * Tela do simulador de pagamento (provedor "fake").
 * Nenhum dado de cartão é salvo; o BFF apenas decide aprovado/recusado.
 */
export default function FakeCheckoutPage() {
  const { orderId = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [card, setCard] = useState(TEST_CARDS[0].number);
  const [holder, setHolder] = useState('VISITANTE DEMO');

  const order = useQuery({ queryKey: ['orders', orderId], queryFn: () => orderApi.get(orderId) });

  const pay = useMutation({
    mutationFn: () => fakePaymentApi.confirm(orderId, card, holder),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(`/pedidos/${orderId}`, { replace: true });
    },
  });

  if (order.isLoading) return <Spinner />;
  if (order.error || !order.data) return <ErrorBox error={order.error} />;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    pay.mutate();
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[1fr_300px]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-md bg-white p-6 shadow-sm">
        <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Pagamento simulado.</strong> Nenhuma cobrança real. Cartões de teste:
          <ul className="mt-1 list-inside list-disc">
            {TEST_CARDS.map((c) => (
              <li key={c.number}>
                <button type="button" onClick={() => setCard(c.number)} className="font-mono underline">
                  {c.number}
                </button>{' '}
                → {c.result}
              </li>
            ))}
          </ul>
        </div>

        <h1 className="text-xl font-semibold">Pagar com cartão</h1>
        <label className="block text-sm">
          Número do cartão
          <input
            value={card}
            onChange={(e) => setCard(e.target.value)}
            inputMode="numeric"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 font-mono"
            required
          />
        </label>
        <label className="block text-sm">
          Nome impresso no cartão
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 uppercase"
            required
          />
        </label>
        {pay.isError && <p className="text-sm text-red-600">{errorMessage(pay.error)}</p>}
        <button
          disabled={pay.isPending}
          className="w-full rounded-md bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {pay.isPending ? 'Processando pagamento…' : `Pagar ${formatBRL(order.data.total)}`}
        </button>
      </form>

      <aside className="h-fit space-y-3 rounded-md bg-white p-5 text-sm shadow-sm">
        <h2 className="font-semibold">Pedido #{order.data.id}</h2>
        {order.data.items.map((i) => (
          <div key={i.productId} className="flex justify-between gap-2">
            <span className="line-clamp-1">
              {i.quantity}× {i.title}
            </span>
            <span>{formatBRL(i.subtotal)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold">
          <span>Total</span>
          <span>{formatBRL(order.data.total)}</span>
        </div>
      </aside>
    </div>
  );
}
