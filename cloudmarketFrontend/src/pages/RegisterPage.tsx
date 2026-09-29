import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { errorMessage } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [params] = useSearchParams();
  const next = params.get('next') || '/';
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    register.mutate(form, { onSuccess: () => navigate(next, { replace: true }) });
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
    className: 'mt-1 w-full rounded border border-gray-300 px-3 py-2',
    required: true,
  });

  return (
    <div className="mx-auto max-w-md rounded-md bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-semibold">Criar conta</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          Nome
          <input {...field('name')} autoComplete="name" />
        </label>
        <label className="block text-sm">
          E-mail
          <input type="email" {...field('email')} autoComplete="email" />
        </label>
        <label className="block text-sm">
          Senha (mínimo 6 caracteres)
          <input type="password" minLength={6} {...field('password')} autoComplete="new-password" />
        </label>
        {register.isError && <p className="text-sm text-red-600">{errorMessage(register.error)}</p>}
        <button
          disabled={register.isPending}
          className="w-full rounded-md bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {register.isPending ? 'Criando…' : 'Criar conta'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        Já tem conta?{' '}
        <Link to="/entrar" className="text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
