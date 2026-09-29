import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Em desenvolvimento o Vite repassa /api para o BFF (Spring Boot na porta 8080).
// Assim o navegador vê tudo na mesma origem e o cookie de sessão funciona sem CORS.
// Em produção, o vercel.json faz o mesmo papel.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
