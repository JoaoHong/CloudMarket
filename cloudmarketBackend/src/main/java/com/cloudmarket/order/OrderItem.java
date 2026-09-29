package com.cloudmarket.order;

import com.cloudmarket.catalog.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    /** Snapshot do título/imagem/preço no momento da compra. */
    @Column(name = "product_title", nullable = false, length = 200)
    private String productTitle;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    public static OrderItem of(Product product, int quantity) {
        OrderItem item = new OrderItem();
        item.product = product;
        item.productTitle = product.getTitle();
        item.imageUrl = product.getImageUrl();
        item.unitPrice = product.getPrice();
        item.quantity = quantity;
        return item;
    }

    public BigDecimal subtotal() {
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}
