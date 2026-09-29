import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { errorMessage } from '../api/client';
import { useAuth } from '../hooks/useAuth';

const DEMO = { email: 'demo@cloudmarket.dev', password: 'senha123' };

export default function LoginPage() {
  const [params] = useSearchParams();
  const next = params.get('next') || '/';
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function submit(credentials: { email: string; password: string }) {
    login.mutate(credentials, { onSuccess: () => navigate(next, { replace: true }) });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit({ email, password });
  }

  return (
    <div className="mx-auto max-w-md rounded-md bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-semibold">Entrar</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            autoComplete="email"
          />
        </label>
        <label className="block text-sm">
          Senha
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            autoComplete="current-password"
          />
        </label>
        {login.isError && <p className="text-sm text-red-600">{errorMessage(login.error)}</p>}
        <button
          disabled={login.isPending}
          className="w-full rounded-md bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {login.isPending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <button
        onClick={() => submit(DEMO)}
        className="mt-3 w-full rounded-md bg-brand-light py-3 font-semibold text-brand hover:brightness-95"
      >
        Entrar com a conta demo
      </button>

      <p className="mt-6 text-center text-sm">
        Não tem conta?{' '}
        <Link to={`/cadastro?next=${encodeURIComponent(next)}`} className="text-brand hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
