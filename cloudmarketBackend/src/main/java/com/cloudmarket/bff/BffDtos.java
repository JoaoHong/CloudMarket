package com.cloudmarket.bff;

import com.cloudmarket.catalog.Category;
import com.cloudmarket.catalog.Product;
import com.cloudmarket.common.PageResponse;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * Modelos de VIEW: cada record tem exatamente o formato que uma tela do React precisa.
 * É aqui que o BFF "traduz" o domínio para a interface.
 */
public final class BffDtos {

    private BffDtos() {
    }

    private static final int MAX_INSTALLMENTS = 12;

    public record CategoryView(Long id, String name, String slug, String icon) {
        static CategoryView from(Category c) {
            return new CategoryView(c.getId(), c.getName(), c.getSlug(), c.getIcon());
        }
    }

    public record Installments(int count, BigDecimal amount, boolean interestFree) {
        static Installments of(BigDecimal price) {
            return new Installments(MAX_INSTALLMENTS,
                    price.divide(BigDecimal.valueOf(MAX_INSTALLMENTS), 2, RoundingMode.HALF_UP), true);
        }
    }

    /** Card de produto usado em vitrines e na busca. */
    public record ProductCard(Long id, String title, String imageUrl, BigDecimal price, BigDecimal originalPrice,
                              int discountPercent, Installments installments, boolean freeShipping,
                              String condition, BigDecimal rating) {
        static ProductCard from(Product p) {
            return new ProductCard(p.getId(), p.getTitle(), p.getImageUrl(), p.getPrice(), p.getOriginalPrice(),
                    p.discountPercent(), Installments.of(p.getPrice()), p.isFreeShipping(),
                    p.getCondition().name(), p.getRating());
        }
    }

    public record HomeView(List<CategoryView> categories, List<ProductCard> deals,
                           List<ProductCard> bestSellers, List<ProductCard> freeShipping) {
    }

    public record SearchView(String query, String category, List<CategoryView> categories,
                             PageResponse<ProductCard> results) {
    }

    public record SellerView(Long id, String name, long activeListings) {
    }

    public record ProductPageView(Long id, String title, String description, String imageUrl,
                                  BigDecimal price, BigDecimal originalPrice, int discountPercent,
                                  Installments installments, boolean freeShipping, String condition,
                                  int stock, int soldCount, BigDecimal rating,
                                  CategoryView category, SellerView seller, List<ProductCard> related) {
    }
}
