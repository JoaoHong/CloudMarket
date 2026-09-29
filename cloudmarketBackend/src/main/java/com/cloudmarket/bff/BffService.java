package com.cloudmarket.bff;

import com.cloudmarket.bff.BffDtos.*;
import com.cloudmarket.catalog.CatalogService;
import com.cloudmarket.catalog.CatalogService.SearchSort;
import com.cloudmarket.catalog.Product;
import com.cloudmarket.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Agrega vários serviços de domínio em UMA resposta por tela,
 * reduzindo o número de chamadas do navegador (papel central de um BFF).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BffService {

    private final CatalogService catalog;

    public HomeView home() {
        return new HomeView(
                catalog.allCategories().stream().map(CategoryView::from).toList(),
                cards(catalog.bestDeals(8)),
                cards(catalog.bestSellers()),
                cards(catalog.freeShippingHighlights()));
    }

    public SearchView search(String q, String category, SearchSort sort, int page, int size) {
        PageResponse<ProductCard> results = PageResponse.from(
                catalog.search(q, category, sort, page, size), ProductCard::from);
        return new SearchView(q, category,
                catalog.allCategories().stream().map(CategoryView::from).toList(),
                results);
    }

    public ProductPageView productPage(Long id) {
        Product p = catalog.getProduct(id);
        SellerView seller = new SellerView(p.getSeller().getId(), p.getSeller().getName(),
                catalog.countProductsBySeller(p.getSeller().getId()));
        return new ProductPageView(
                p.getId(), p.getTitle(), p.getDescription(), p.getImageUrl(),
                p.getPrice(), p.getOriginalPrice(), p.discountPercent(),
                Installments.of(p.getPrice()), p.isFreeShipping(), p.getCondition().name(),
                p.getStock(), p.getSoldCount(), p.getRating(),
                CategoryView.from(p.getCategory()), seller,
                cards(catalog.related(p)));
    }

    private static List<ProductCard> cards(List<Product> products) {
        return products.stream().map(ProductCard::from).toList();
    }
}
