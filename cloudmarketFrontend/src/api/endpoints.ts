import { api } from './client';
import type {
  CheckoutSession,
  HomeView,
  Order,
  OrderStatus,
  ProductPageView,
  SearchSort,
  SearchView,
  User,
} from '../types';

// ---------- BFF (leitura, uma chamada por tela) ----------
export const bffApi = {
  home: () => api.get<HomeView>('/bff/home').then((r) => r.data),

  search: (params: { q?: string; category?: string; sort?: SearchSort; page?: number }) =>
    api.get<SearchView>('/bff/search', { params }).then((r) => r.data),

  product: (id: string | number) => api.get<ProductPageView>(`/bff/products/${id}`).then((r) => r.data),
};

// ---------- Autenticação ----------
export const authApi = {
  me: () => api.get<User | ''>('/auth/me').then((r) => (r.status === 204 || !r.data ? null : r.data)),
  login: (email: string, password: string) =>
    api.post<User>('/auth/login', { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post<User>('/auth/register', { name, email, password }).then((r) => r.data),
  logout: () => api.post('/auth/logout'),
};

// ---------- Pedidos e pagamento ----------
export const orderApi = {
  create: (items: { productId: number; quantity: number }[]) =>
    api.post<Order>('/orders', { items }).then((r) => r.data),
  list: () => api.get<Order[]>('/orders').then((r) => r.data),
  get: (id: string | number) => api.get<Order>(`/orders/${id}`).then((r) => r.data),
  checkout: (id: number) => api.post<CheckoutSession>(`/orders/${id}/checkout`).then((r) => r.data),
};

export const fakePaymentApi = {
  confirm: (orderId: string | number, cardNumber: string, holderName: string) =>
    api
      .post<{ orderId: number; status: OrderStatus; message: string }>(`/payments/fake/${orderId}/confirm`, {
        cardNumber,
        holderName,
      })
      .then((r) => r.data),
};
