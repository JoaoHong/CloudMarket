import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { bffApi } from '../api/endpoints';
import ProductShelf from '../components/ProductShelf';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';

export default function HomePage() {
  // Uma única chamada ao BFF traz tudo o que a home precisa
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['bff', 'home'], queryFn: bffApi.home });

  if (isLoading) return <Spinner label="Carregando ofertas… (o servidor gratuito pode levar ~1 min para acordar)" />;
  if (error || !data) return <ErrorBox error={error} onRetry={() => refetch()} />;

  return (
    <div className="space-y-10">
      <section className="rounded-lg bg-gradient-to-r from-brand to-brand-dark p-8 text-white">
        <p className="text-sm uppercase tracking-widest text-white/70">Projeto de estudo</p>
        <h1 className="mt-2 text-3xl font-bold">Tudo o que você procura, nas nuvens.</h1>
        <p className="mt-2 max-w-xl text-white/80">
          Compre com pagamento simulado. Use a conta demo ou crie a sua — nenhuma cobrança é real.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {data.categories.map((c) => (
          <Link
            key={c.id}
            to={`/busca?category=${c.slug}`}
            className="flex flex-col items-center gap-2 rounded-md bg-white p-4 text-center text-xs shadow-sm hover:shadow-md"
          >
            <span className="text-3xl" aria-hidden>
              {c.icon}
            </span>
            {c.name}
          </Link>
        ))}
      </section>

      <ProductShelf title="Ofertas do dia" products={data.deals} />
      <ProductShelf title="Mais vendidos" products={data.bestSellers} />
      <ProductShelf title="Frete grátis" products={data.freeShipping} />
    </div>
  );
}
