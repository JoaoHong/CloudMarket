package com.cloudmarket.order;

import com.cloudmarket.auth.AppUserPrincipal;
import com.cloudmarket.order.OrderDtos.CreateOrderRequest;
import com.cloudmarket.order.OrderDtos.OrderResponse;
import com.cloudmarket.payment.PaymentService;
import com.cloudmarket.payment.CheckoutSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@AuthenticationPrincipal AppUserPrincipal user,
                                @Valid @RequestBody CreateOrderRequest body) {
        Order order = orderService.createOrder(user.id(), body.items());
        return OrderResponse.from(orderService.orderOf(order.getId(), user.id()));
    }

    @GetMapping
    public List<OrderResponse> list(@AuthenticationPrincipal AppUserPrincipal user) {
        return orderService.ordersOf(user.id()).stream().map(OrderResponse::from).toList();
    }

    @GetMapping("/{id}")
    public OrderResponse get(@AuthenticationPrincipal AppUserPrincipal user, @PathVariable Long id) {
        return OrderResponse.from(orderService.orderOf(id, user.id()));
    }

    /** Inicia o pagamento e devolve para onde o front deve redirecionar o usuário. */
    @PostMapping("/{id}/checkout")
    public CheckoutSession checkout(@AuthenticationPrincipal AppUserPrincipal user, @PathVariable Long id) {
        return paymentService.startCheckout(id, user.id());
    }
}
