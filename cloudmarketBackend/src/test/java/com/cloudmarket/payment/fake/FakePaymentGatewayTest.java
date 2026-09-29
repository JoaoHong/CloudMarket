package com.cloudmarket.payment.fake;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class FakePaymentGatewayTest {

    private final FakePaymentGateway gateway = new FakePaymentGateway();

    @Test
    void approvesTestCard() {
        var result = gateway.authorize("4111 1111 1111 1111");
        assertThat(result.approved()).isTrue();
        assertThat(result.reference()).startsWith("FAKE-");
    }

    @Test
    void declinesDeclinedCard() {
        assertThat(gateway.authorize("4000 0000 0000 0002").approved()).isFalse();
    }

    @Test
    void rejectsInvalidCardNumber() {
        assertThat(gateway.authorize("123").approved()).isFalse();
    }
}
