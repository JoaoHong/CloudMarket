import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { cartCount, useCart } from '../store/cart';

export default function Header() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const { user, logout } = useAuth();
  const count = useCart((s) => cartCount(s.items));

  function onSearch(e: FormEvent) {
    e.preventDefault();
    navigate(`/busca?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="bg-brand text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span aria-hidden>☁️</span> Cloud Market
        </Link>

        <form onSubmit={onSearch} className="order-last flex w-full flex-1 sm:order-none sm:w-auto" role="search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produtos, marcas e muito mais…"
            className="w-full rounded-l-md bg-white px-4 py-2 text-sm text-gray-800 outline-none"
            aria-label="Buscar"
          />
          <button className="rounded-r-md bg-accent px-4 text-sm font-semibold text-gray-900 hover:brightness-95">
            Buscar
          </button>
        </form>

        <nav className="ml-auto flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="hidden md:inline">Olá, {user.name.split(' ')[0]}</span>
              <Link to="/pedidos" className="hover:underline">
                Minhas compras
              </Link>
              <button onClick={() => logout.mutate()} className="hover:underline">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/cadastro" className="hover:underline">
                Crie a sua conta
              </Link>
              <Link to="/entrar" className="hover:underline">
                Entre
              </Link>
            </>
          )}
          <Link to="/carrinho" className="relative text-lg" aria-label={`Carrinho com ${count} itens`}>
            🛒
            {count > 0 && (
              <span className="absolute -top-2 -right-3 rounded-full bg-accent px-1.5 text-xs font-bold text-gray-900">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
