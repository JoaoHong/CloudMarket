package com.cloudmarket.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configurações da aplicação (prefixo "cloudmarket" no application.yaml).
 */
@ConfigurationProperties(prefix = "cloudmarket")
public record CloudMarketProperties(
        String frontendUrl,
        String backendUrl,
        Payment payment,
        Demo demo
) {
    public record Payment(String provider, MercadoPago mercadopago) {
    }

    public record MercadoPago(String accessToken) {
    }

    public record Demo(boolean enabled) {
    }
}
