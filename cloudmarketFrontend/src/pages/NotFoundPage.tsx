import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="rounded-md bg-white p-10 text-center shadow-sm">
      <p className="text-5xl">☁️</p>
      <h1 className="mt-4 text-2xl font-semibold">Parece que esta página não existe</h1>
      <Link to="/" className="mt-4 inline-block text-brand hover:underline">
        Voltar para a página inicial
      </Link>
    </div>
  );
}
