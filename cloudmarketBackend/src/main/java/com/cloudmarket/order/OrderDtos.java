package com.cloudmarket.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class OrderDtos {

    private OrderDtos() {
    }

    public record CreateOrderRequest(@NotEmpty(message = "O carrinho está vazio") List<@Valid CartItem> items) {
    }

    public record CartItem(@NotNull Long productId,
                           @NotNull @Min(1) @Max(99) Integer quantity) {
    }

    public record OrderItemResponse(Long productId, String title, String imageUrl,
                                    BigDecimal unitPrice, int quantity, BigDecimal subtotal) {
        static OrderItemResponse from(OrderItem i) {
            return new OrderItemResponse(i.getProduct().getId(), i.getProductTitle(), i.getImageUrl(),
                    i.getUnitPrice(), i.getQuantity(), i.subtotal());
        }
    }

    public record OrderResponse(Long id, OrderStatus status, BigDecimal total, String paymentProvider,
                                Instant createdAt, List<OrderItemResponse> items) {
        public static OrderResponse from(Order o) {
            return new OrderResponse(o.getId(), o.getStatus(), o.getTotal(), o.getPaymentProvider(),
                    o.getCreatedAt(), o.getItems().stream().map(OrderItemResponse::from).toList());
        }
    }
}
