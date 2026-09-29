import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router';
import { orderApi } from '../api/endpoints';
import { errorMessage } from '../api/client';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';
import { formatBRL, formatDate, orderStatusLabel } from '../utils/format';

export default function OrderPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderApi.get(id),
    // enquanto aguarda webhook do provedor externo, atualiza a cada 5s
    refetchInterval: (q) => (q.state.data?.status === 'PENDING_PAYMENT' ? 5000 : false),
  });

  const retry = useMutation({
    mutationFn: () => orderApi.checkout(Number(id)),
    onSuccess: (session) => {
      if (/^https?:\/\//.test(session.redirectUrl)) window.location.href = session.redirectUrl;
      else navigate(session.redirectUrl);
    },
  });

  if (isLoading) return <Spinner />;
  if (error || !order) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const status = orderStatusLabel[order.status];
  const canPay = order.status === 'PENDING_PAYMENT' || order.status === 'PAYMENT_FAILED';

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link to="/pedidos" className="text-sm text-brand hover:underline">
        ‹ Minhas compras
      </Link>
      <div className="rounded-md bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-semibold">Pedido #{order.id}</h1>
          <span className={`rounded px-2 py-1 text-sm font-semibold ${status.className}`}>{status.label}</span>
        </div>
        <p className="text-sm text-gray-500">
          {formatDate(order.createdAt)}
          {order.paymentProvider && ` · pagamento via ${order.paymentProvider}`}
        </p>

        {order.status === 'PAID' && (
          <p className="mt-4 rounded bg-green-50 p-3 text-green-800">
            🎉 Compra aprovada! (simulação — nada será enviado de verdade)
          </p>
        )}

        <div className="mt-6 divide-y divide-gray-100">
          {order.items.map((i) => (
            <div key={i.productId} className="flex items-center gap-4 py-3">
              {i.imageUrl && <img src={i.imageUrl} alt="" className="h-14 w-14 rounded object-cover" />}
              <Link to={`/produto/${i.productId}`} className="flex-1 text-sm hover:text-brand">
                {i.title}
              </Link>
              <span className="text-sm text-gray-500">
                {i.quantity} × {formatBRL(i.unitPrice)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>{formatBRL(order.total)}</span>
        </div>

        {canPay && (
          <button
            onClick={() => retry.mutate()}
            disabled={retry.isPending}
            className="mt-4 w-full rounded-md bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {order.status === 'PAYMENT_FAILED' ? 'Tentar pagar novamente' : 'Ir para o pagamento'}
          </button>
        )}
        {retry.isError && <p className="mt-2 text-sm text-red-600">{errorMessage(retry.error)}</p>}
      </div>
    </div>
  );
}
