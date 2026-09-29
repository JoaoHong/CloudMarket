package com.cloudmarket.order;

import com.cloudmarket.catalog.Product;
import com.cloudmarket.catalog.ProductRepository;
import com.cloudmarket.common.BusinessException;
import com.cloudmarket.common.NotFoundException;
import com.cloudmarket.order.OrderDtos.CartItem;
import com.cloudmarket.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orders;
    private final ProductRepository products;
    private final UserRepository users;

    /**
     * Cria o pedido a partir do carrinho. Os preços SEMPRE vêm do banco,
     * nunca do navegador.
     */
    @Transactional
    public Order createOrder(Long buyerId, List<CartItem> cart) {
        Map<Long, Integer> quantities = cart.stream()
                .collect(Collectors.toMap(CartItem::productId, CartItem::quantity, Integer::sum));

        Map<Long, Product> found = products.findAllById(quantities.keySet()).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        Order order = new Order();
        order.setBuyer(users.getReferenceById(buyerId));

        quantities.forEach((productId, qty) -> {
            Product product = found.get(productId);
            if (product == null) {
                throw new NotFoundException("Produto " + productId + " não encontrado.");
            }
            if (qty > product.getStock()) {
                throw new BusinessException("Estoque insuficiente para \"" + product.getTitle() + "\".");
            }
            if (product.getSeller().getId().equals(buyerId)) {
                throw new BusinessException("Você não pode comprar o próprio produto.");
            }
            order.addItem(OrderItem.of(product, qty));
        });

        return orders.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> ordersOf(Long buyerId) {
        List<Order> list = orders.findByBuyerIdOrderByCreatedAtDesc(buyerId);
        list.forEach(o -> o.getItems().forEach(i -> i.getProduct().getId()));
        return list;
    }

    @Transactional(readOnly = true)
    public Order orderOf(Long orderId, Long buyerId) {
        return orders.findByIdAndBuyerId(orderId, buyerId)
                .orElseThrow(() -> new NotFoundException("Pedido " + orderId + " não encontrado."));
    }

    /** Chamado pelo módulo de pagamento quando o pagamento é aprovado. */
    @Transactional
    public void markPaid(Long orderId, String provider, String reference) {
        Order order = orders.findWithItemsById(orderId)
                .orElseThrow(() -> new NotFoundException("Pedido " + orderId + " não encontrado."));
        if (order.getStatus() == OrderStatus.PAID) {
            return; // idempotente: webhooks podem chegar mais de uma vez
        }
        order.getItems().forEach(item -> item.getProduct().decreaseStock(item.getQuantity()));
        order.setPaymentProvider(provider);
        order.setPaymentReference(reference);
        order.changeStatus(OrderStatus.PAID);
    }

    @Transactional
    public void markPaymentFailed(Long orderId, String provider, String reference) {
        Order order = orders.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Pedido " + orderId + " não encontrado."));
        if (order.getStatus() == OrderStatus.PAID) {
            return;
        }
        order.setPaymentProvider(provider);
        order.setPaymentReference(reference);
        order.changeStatus(OrderStatus.PAYMENT_FAILED);
    }
}
