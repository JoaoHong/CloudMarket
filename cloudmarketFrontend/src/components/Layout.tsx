import { Outlet } from 'react-router';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
        <p>Cloud Market — projeto de estudo (Spring Boot BFF + React). Nenhuma compra é real.</p>
      </footer>
    </div>
  );
}
