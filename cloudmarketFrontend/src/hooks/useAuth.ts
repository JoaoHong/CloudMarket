import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/endpoints';
import { ensureCsrfCookie } from '../api/client';

const ME_KEY = ['auth', 'me'] as const;

/** Estado de autenticação vindo do BFF (sessão no servidor). */
export function useAuth() {
  const queryClient = useQueryClient();

  const me = useQuery({ queryKey: ME_KEY, queryFn: authApi.me, staleTime: 5 * 60_000 });

  const login = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    onSuccess: (user) => queryClient.setQueryData(ME_KEY, user),
  });

  const register = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      authApi.register(name, email, password),
    onSuccess: (user) => queryClient.setQueryData(ME_KEY, user),
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: async () => {
      queryClient.setQueryData(ME_KEY, null);
      queryClient.removeQueries({ queryKey: ['orders'] });
      await ensureCsrfCookie(); // o logout invalida o token CSRF
    },
  });

  return {
    user: me.data ?? null,
    isLoading: me.isLoading,
    login,
    register,
    logout,
  };
}
