// Tipos espelhando os records do BFF (com.cloudmarket.bff.BffDtos etc.)

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

export interface Installments {
  count: number;
  amount: number;
  interestFree: boolean;
}

export interface ProductCard {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number;
  installments: Installments;
  freeShipping: boolean;
  condition: 'NEW' | 'USED';
  rating: number | null;
}

export interface HomeView {
  categories: Category[];
  deals: ProductCard[];
  bestSellers: ProductCard[];
  freeShipping: ProductCard[];
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type SearchSort = 'RELEVANCE' | 'PRICE_ASC' | 'PRICE_DESC';

export interface SearchView {
  query: string;
  category: string;
  categories: Category[];
  results: Page<ProductCard>;
}

export interface ProductPageView extends ProductCard {
  description: string;
  stock: number;
  soldCount: number;
  category: Category;
  seller: { id: number; name: string; activeListings: number };
  related: ProductCard[];
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'PAYMENT_FAILED' | 'SHIPPED' | 'CANCELLED';

export interface OrderItem {
  productId: number;
  title: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  paymentProvider: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface CheckoutSession {
  orderId: number;
  provider: string;
  redirectUrl: string;
}
