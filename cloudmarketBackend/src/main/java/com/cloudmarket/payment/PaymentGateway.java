package com.cloudmarket.payment;

import com.cloudmarket.order.Order;

/**
 * Porta de pagamento (Ports & Adapters). Trocar de provedor = trocar a implementação,
 * sem mexer em pedidos nem no front. Selecionado por cloudmarket.payment.provider.
 */
public interface PaymentGateway {

    /** Identificador do provedor, salvo no pedido (ex.: "fake", "mercadopago"). */
    String name();

    CheckoutSession createCheckout(Order order);
}
