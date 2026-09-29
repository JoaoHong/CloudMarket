package com.cloudmarket.payment.fake;

import com.cloudmarket.auth.AppUserPrincipal;
import com.cloudmarket.common.BusinessException;
import com.cloudmarket.order.Order;
import com.cloudmarket.order.OrderService;
import com.cloudmarket.order.OrderStatus;
import com.cloudmarket.payment.fake.FakePaymentGateway.FakeAuthorization;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/fake")
@RequiredArgsConstructor
@ConditionalOnProperty(name = "cloudmarket.payment.provider", havingValue = "fake", matchIfMissing = true)
public class FakePaymentController {

    private final FakePaymentGateway gateway;
    private final OrderService orderService;

    public record ConfirmRequest(@NotBlank String cardNumber, @NotBlank String holderName) {
    }

    public record ConfirmResponse(Long orderId, OrderStatus status, String message) {
    }

    @PostMapping("/{orderId}/confirm")
    public ConfirmResponse confirm(@AuthenticationPrincipal AppUserPrincipal user,
                                   @PathVariable Long orderId,
                                   @Valid @RequestBody ConfirmRequest body) {
        Order order = orderService.orderOf(orderId, user.id());
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BusinessException("Este pedido não está aguardando pagamento.");
        }

        FakeAuthorization result = gateway.authorize(body.cardNumber());
        if (result.approved()) {
            orderService.markPaid(orderId, gateway.name(), result.reference());
            return new ConfirmResponse(orderId, OrderStatus.PAID, result.message());
        }
        orderService.markPaymentFailed(orderId, gateway.name(), result.reference());
        return new ConfirmResponse(orderId, OrderStatus.PAYMENT_FAILED, result.message());
    }
}
