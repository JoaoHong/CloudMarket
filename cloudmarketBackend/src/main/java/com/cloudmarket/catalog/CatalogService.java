package com.cloudmarket.catalog;

import com.cloudmarket.common.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Regras de catálogo. Não conhece o formato das telas — isso é papel da camada BFF.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogService {

    public enum SearchSort { RELEVANCE, PRICE_ASC, PRICE_DESC }

    private final ProductRepository products;
    private final CategoryRepository categories;

    public List<Category> allCategories() {
        return categories.findAllByOrderByNameAsc();
    }

    public Page<Product> search(String q, String categorySlug, SearchSort sort, int page, int size) {
        Sort order = switch (sort) {
            case PRICE_ASC -> Sort.by("price").ascending();
            case PRICE_DESC -> Sort.by("price").descending();
            case RELEVANCE -> Sort.by("soldCount").descending();
        };
        int safeSize = Math.min(Math.max(size, 1), 48);
        return products.search(
                q == null ? "" : q.trim(),
                categorySlug == null ? "" : categorySlug.trim(),
                PageRequest.of(Math.max(page, 0), safeSize, order));
    }

    public Product getProduct(Long id) {
        return products.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto " + id + " não encontrado."));
    }

    public List<Product> bestSellers() {
        return products.findTop8ByOrderBySoldCountDesc();
    }

    public List<Product> freeShippingHighlights() {
        return products.findTop8ByFreeShippingTrueOrderByRatingDesc();
    }

    public List<Product> bestDeals(int limit) {
        return products.findBestDeals(PageRequest.of(0, limit));
    }

    public List<Product> related(Product product) {
        return products.findTop6ByCategoryIdAndIdNotOrderBySoldCountDesc(product.getCategory().getId(), product.getId());
    }

    public long countProductsBySeller(Long sellerId) {
        return products.countBySellerId(sellerId);
    }
}
