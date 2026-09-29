import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { orderApi } from '../api/endpoints';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';
import { formatBRL, formatDate, orderStatusLabel } from '../utils/format';

export default function OrdersPage() {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['orders'], queryFn: orderApi.list });

  if (isLoading) return <Spinner />;
  if (error || !data) return <ErrorBox error={error} onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Minhas compras</h1>
      {data.length === 0 && (
        <div className="rounded-md bg-white p-10 text-center shadow-sm">
          <p>Você ainda não fez nenhuma compra.</p>
          <Link to="/" className="text-brand hover:underline">
            Começar a comprar
          </Link>
        </div>
      )}
      {data.map((o) => {
        const status = orderStatusLabel[o.status];
        return (
          <Link
            key={o.id}
            to={`/pedidos/${o.id}`}
            className="flex items-center gap-4 rounded-md bg-white p-4 shadow-sm hover:shadow-md"
          >
            {o.items[0]?.imageUrl && <img src={o.items[0].imageUrl} alt="" className="h-16 w-16 rounded object-cover" />}
            <div className="flex-1">
              <p className="text-sm text-gray-500">
                Pedido #{o.id} · {formatDate(o.createdAt)}
              </p>
              <p className="line-clamp-1 font-medium">
                {o.items.map((i) => i.title).join(', ')}
              </p>
            </div>
            <span className={`rounded px-2 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
            <span className="w-28 text-right">{formatBRL(o.total)}</span>
          </Link>
        );
      })}
    </div>
  );
}
