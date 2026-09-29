package com.cloudmarket.payment;

/**
 * Resultado do início de um pagamento.
 *
 * @param redirectUrl para onde o front deve mandar o usuário:
 *                    caminho relativo (simulador interno) ou URL absoluta (checkout externo).
 */
public record CheckoutSession(Long orderId, String provider, String redirectUrl) {
}
