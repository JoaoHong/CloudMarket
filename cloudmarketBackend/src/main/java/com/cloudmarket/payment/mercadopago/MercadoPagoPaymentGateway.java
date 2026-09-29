package com.cloudmarket.payment.mercadopago;

import com.cloudmarket.common.BusinessException;
import com.cloudmarket.config.CloudMarketProperties;
import com.cloudmarket.order.Order;
import com.cloudmarket.payment.CheckoutSession;
import com.cloudmarket.payment.PaymentGateway;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Checkout Pro do Mercado Pago em modo TESTE.
 * Use o Access Token de TESTE de um usuário de teste (painel "Suas integrações").
 * Nenhuma cobrança real acontece; pague com os cartões de teste da documentação do Mercado Pago.
 */
@Slf4j
@Component
@ConditionalOnProperty(name = "cloudmarket.payment.provider", havingValue = "mercadopago")
public class MercadoPagoPaymentGateway implements PaymentGateway {

    private static final ParameterizedTypeReference<Map<String, Object>> JSON_MAP = new ParameterizedTypeReference<>() {
    };

    private final RestClient client;
    private final CloudMarketProperties properties;

    public MercadoPagoPaymentGateway(CloudMarketProperties properties) {
        this.properties = properties;
        String token = properties.payment().mercadopago().accessToken();
        if (!StringUtils.hasText(token)) {
            throw new IllegalStateException("Defina MERCADOPAGO_ACCESS_TOKEN (credencial de TESTE) para usar o provedor mercadopago.");
        }
        this.client = RestClient.builder()
                .baseUrl("https://api.mercadopago.com")
                .defaultHeader("Authorization", "Bearer " + token)
                .build();
    }

    @Override
    public String name() {
        return "mercadopago";
    }

    @Override
    public CheckoutSession createCheckout(Order order) {
        String front = properties.frontendUrl();
        String back = properties.backendUrl();

        List<Map<String, Object>> items = order.getItems().stream()
                .map(i -> Map.<String, Object>of(
                        "id", String.valueOf(i.getProduct().getId()),
                        "title", i.getProductTitle(),
                        "quantity", i.getQuantity(),
                        "unit_price", i.getUnitPrice(),
                        "currency_id", "BRL"))
                .toList();

        String orderPage = front + "/pedidos/" + order.getId();
        Map<String, Object> body = new HashMap<>();
        body.put("items", items);
        body.put("external_reference", String.valueOf(order.getId()));
        body.put("back_urls", Map.of("success", orderPage, "failure", orderPage, "pending", orderPage));
        // O Mercado Pago só aceita auto_return e webhook com URLs públicas HTTPS
        if (front.startsWith("https://")) {
            body.put("auto_return", "approved");
        }
        if (back.startsWith("https://")) {
            body.put("notification_url", back + "/api/payments/webhooks/mercadopago");
        }

        try {
            Map<String, Object> preference = client.post()
                    .uri("/checkout/preferences")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(JSON_MAP);
            Object url = preference.get("init_point");
            if (url == null) {
                url = preference.get("sandbox_init_point");
            }
            return new CheckoutSession(order.getId(), name(), String.valueOf(url));
        } catch (RestClientException ex) {
            log.error("Erro ao criar preferência no Mercado Pago", ex);
            throw new BusinessException("Não foi possível iniciar o pagamento no Mercado Pago.");
        }
    }

    /** Consulta o pagamento direto na API (não confiamos no corpo do webhook). */
    public Map<String, Object> fetchPayment(String paymentId) {
        return client.get()
                .uri("/v1/payments/{id}", paymentId)
                .retrieve()
                .body(JSON_MAP);
    }
}
