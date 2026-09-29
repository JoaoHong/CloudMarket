import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { orderApi } from '../api/endpoints';

/**
 * Fluxo de compra: cria o pedido no BFF -> inicia o pagamento -> redireciona.
 * O redirect pode ser interno (simulador) ou externo (Mercado Pago sandbox).
 */
export function useCheckout(onOrderCreated?: () => void) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (items: { productId: number; quantity: number }[]) => {
      const order = await orderApi.create(items);
      onOrderCreated?.();
      return orderApi.checkout(order.id);
    },
    onSuccess: (session) => {
      if (/^https?:\/\//.test(session.redirectUrl)) {
        window.location.href = session.redirectUrl;
      } else {
        navigate(session.redirectUrl);
      }
    },
  });
}
