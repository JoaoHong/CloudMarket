package com.cloudmarket.payment;

import com.cloudmarket.common.BusinessException;
import com.cloudmarket.order.Order;
import com.cloudmarket.order.OrderRepository;
import com.cloudmarket.order.OrderStatus;
import com.cloudmarket.common.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentGateway gateway;
    private final OrderRepository orders;

    @Transactional
    public CheckoutSession startCheckout(Long orderId, Long buyerId) {
        Order order = orders.findByIdAndBuyerId(orderId, buyerId)
                .orElseThrow(() -> new NotFoundException("Pedido " + orderId + " não encontrado."));

        if (order.getStatus() == OrderStatus.PAYMENT_FAILED) {
            order.changeStatus(OrderStatus.PENDING_PAYMENT); // permite tentar de novo
        }
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BusinessException("Este pedido não está aguardando pagamento.");
        }
        order.setPaymentProvider(gateway.name());
        return gateway.createCheckout(order);
    }
}
