import axios, { AxiosError } from 'axios';

/**
 * Todas as chamadas vão para /api na MESMA origem do site
 * (proxy do Vite em dev, rewrite do Vercel em produção).
 * O cookie de sessão é HttpOnly: o JavaScript nunca vê credenciais.
 */
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

export async function ensureCsrfCookie() {
  try {
    await api.get('/auth/csrf');
  } catch {
    // backend pode estar "acordando" (plano gratuito); a próxima chamada tenta de novo
  }
}

/** Extrai a mensagem amigável de um ProblemDetail do Spring. */
export function errorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { detail?: string; errors?: Record<string, string> } | undefined;
    if (data?.errors) {
      const first = Object.values(data.errors)[0];
      if (first) return first;
    }
    if (data?.detail) return data.detail;
    if (!error.response) return 'Servidor indisponível. Se for o primeiro acesso, aguarde ~1 minuto: o servidor gratuito está acordando.';
  }
  return fallback;
}
