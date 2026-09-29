package com.cloudmarket.catalog;

import com.cloudmarket.common.BusinessException;
import com.cloudmarket.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 4000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_condition", nullable = false, length = 10)
    private ItemCondition condition = ItemCondition.NEW;

    @Column(name = "free_shipping", nullable = false)
    private boolean freeShipping;

    @Column(name = "sold_count", nullable = false)
    private Integer soldCount = 0;

    @Column(precision = 2, scale = 1)
    private BigDecimal rating;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id")
    private User seller;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    /** Percentual de desconto em relação ao preço original (0 se não houver). */
    public int discountPercent() {
        if (originalPrice == null || originalPrice.compareTo(price) <= 0) {
            return 0;
        }
        return originalPrice.subtract(price)
                .multiply(BigDecimal.valueOf(100))
                .divide(originalPrice, 0, java.math.RoundingMode.HALF_UP)
                .intValue();
    }

    public void decreaseStock(int quantity) {
        if (quantity > stock) {
            throw new BusinessException("Estoque insuficiente para \"" + title + "\".");
        }
        stock -= quantity;
        soldCount += quantity;
    }
}
