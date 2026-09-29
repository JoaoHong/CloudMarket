import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';
import { bffApi } from '../api/endpoints';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';
import type { SearchSort } from '../types';

const sortOptions: { value: SearchSort; label: string }[] = [
  { value: 'RELEVANCE', label: 'Mais relevantes' },
  { value: 'PRICE_ASC', label: 'Menor preço' },
  { value: 'PRICE_DESC', label: 'Maior preço' },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const sort = (params.get('sort') as SearchSort) || 'RELEVANCE';
  const page = Number(params.get('page') ?? 0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['bff', 'search', q, category, sort, page],
    queryFn: () => bffApi.search({ q, category, sort, page }),
    placeholderData: keepPreviousData,
  });

  function update(changes: Record<string, string>) {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in changes)) next.delete('page');
    setParams(next);
  }

  if (isLoading) return <Spinner />;
  if (error || !data) return <ErrorBox error={error} onRetry={() => refetch()} />;

  const { results } = data;
  const currentCategory = data.categories.find((c) => c.slug === category);

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold capitalize">{q || currentCategory?.name || 'Todos os produtos'}</h1>
          <p className="text-sm text-gray-500">{results.totalElements} resultados</p>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold">Categorias</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <button onClick={() => update({ category: '' })} className={!category ? 'font-semibold' : 'text-gray-600 hover:text-brand'}>
                Todas
              </button>
            </li>
            {data.categories.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => update({ category: c.slug })}
                  className={c.slug === category ? 'font-semibold text-brand' : 'text-gray-600 hover:text-brand'}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="flex justify-end">
          <label className="text-sm text-gray-600">
            Ordenar por{' '}
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="rounded border border-gray-300 bg-white px-2 py-1"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.content.length === 0 ? (
          <div className="rounded-md bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold">Não há anúncios que correspondem à sua busca.</p>
            <Link to="/busca" className="mt-2 inline-block text-brand hover:underline">
              Ver todos os produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {results.content.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {results.totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 pt-4" aria-label="Paginação">
            <button
              disabled={page === 0}
              onClick={() => update({ page: String(page - 1) })}
              className="rounded px-3 py-1 text-brand disabled:text-gray-300"
            >
              ‹ Anterior
            </button>
            <span className="text-sm text-gray-600">
              {page + 1} de {results.totalPages}
            </span>
            <button
              disabled={page + 1 >= results.totalPages}
              onClick={() => update({ page: String(page + 1) })}
              className="rounded px-3 py-1 text-brand disabled:text-gray-300"
            >
              Seguinte ›
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}
