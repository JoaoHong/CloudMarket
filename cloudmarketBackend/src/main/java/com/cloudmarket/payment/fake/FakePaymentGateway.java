package com.cloudmarket.payment.fake;

import com.cloudmarket.order.Order;
import com.cloudmarket.payment.CheckoutSession;
import com.cloudmarket.payment.PaymentGateway;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Simulador de pagamentos: nenhum dinheiro real, nenhuma conta externa.
 * O front mostra um formulário de cartão fictício e confirma em /api/payments/fake/{orderId}/confirm.
 *
 * Cartões de teste:
 *  - 4111 1111 1111 1111 -> aprovado
 *  - 4000 0000 0000 0002 -> recusado (saldo insuficiente)
 *  - qualquer outro com 16 dígitos -> aprovado
 */
@Component
@ConditionalOnProperty(name = "cloudmarket.payment.provider", havingValue = "fake", matchIfMissing = true)
public class FakePaymentGateway implements PaymentGateway {

    public static final String DECLINED_CARD = "4000000000000002";

    public record FakeAuthorization(boolean approved, String reference, String message) {
    }

    @Override
    public String name() {
        return "fake";
    }

    @Override
    public CheckoutSession createCheckout(Order order) {
        return new CheckoutSession(order.getId(), name(), "/checkout/simulado/" + order.getId());
    }

    public FakeAuthorization authorize(String cardNumber) {
        String digits = cardNumber == null ? "" : cardNumber.replaceAll("\\D", "");
        String reference = "FAKE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        if (digits.length() != 16) {
            return new FakeAuthorization(false, reference, "Número de cartão inválido.");
        }
        if (DECLINED_CARD.equals(digits)) {
            return new FakeAuthorization(false, reference, "Pagamento recusado: saldo insuficiente (simulado).");
        }
        return new FakeAuthorization(true, reference, "Pagamento aprovado (simulado).");
    }
}
