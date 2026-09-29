package com.cloudmarket.payment.mercadopago;

import com.cloudmarket.order.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Recebe notificações do Mercado Pago. Por segurança, o status é sempre confirmado
 * consultando a API do Mercado Pago com nosso token (o corpo da notificação só traz o id).
 */
@Slf4j
@RestController
@RequestMapping("/api/payments/webhooks/mercadopago")
@RequiredArgsConstructor
@ConditionalOnProperty(name = "cloudmarket.payment.provider", havingValue = "mercadopago")
public class MercadoPagoWebhookController {

    private final MercadoPagoPaymentGateway gateway;
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Void> receive(@RequestParam Map<String, String> params,
                                        @RequestBody(required = false) Map<String, Object> body) {
        String type = params.getOrDefault("type", params.get("topic"));
        String paymentId = params.get("data.id");
        if (body != null) {
            if (type == null && body.get("type") != null) {
                type = String.valueOf(body.get("type"));
            }
            if (paymentId == null && body.get("data") instanceof Map<?, ?> data && data.get("id") != null) {
                paymentId = String.valueOf(data.get("id"));
            }
        }
        if (!"payment".equals(type) || paymentId == null) {
            return ResponseEntity.ok().build(); // outros eventos são ignorados
        }

        Map<String, Object> payment = gateway.fetchPayment(paymentId);
        Object status = payment.get("status");
        Object externalRef = payment.get("external_reference");
        if (externalRef == null) {
            return ResponseEntity.ok().build();
        }
        Long orderId = Long.valueOf(String.valueOf(externalRef));
        log.info("Webhook Mercado Pago: pagamento {} do pedido {} com status {}", paymentId, orderId, status);

        if ("approved".equals(status)) {
            orderService.markPaid(orderId, gateway.name(), paymentId);
        } else if ("rejected".equals(status) || "cancelled".equals(status)) {
            orderService.markPaymentFailed(orderId, gateway.name(), paymentId);
        }
        return ResponseEntity.ok().build();
    }
}
