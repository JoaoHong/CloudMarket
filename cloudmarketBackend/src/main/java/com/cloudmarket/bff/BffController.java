package com.cloudmarket.bff;

import com.cloudmarket.bff.BffDtos.HomeView;
import com.cloudmarket.bff.BffDtos.ProductPageView;
import com.cloudmarket.bff.BffDtos.SearchView;
import com.cloudmarket.catalog.CatalogService.SearchSort;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints orientados a TELAS (uma rota por página do React).
 */
@RestController
@RequestMapping("/api/bff")
@RequiredArgsConstructor
public class BffController {

    private final BffService bff;

    /** Página inicial: categorias + vitrines. */
    @GetMapping("/home")
    public HomeView home() {
        return bff.home();
    }

    /** Página de busca/listagem. */
    @GetMapping("/search")
    public SearchView search(@RequestParam(defaultValue = "") String q,
                             @RequestParam(defaultValue = "") String category,
                             @RequestParam(defaultValue = "RELEVANCE") SearchSort sort,
                             @RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "12") int size) {
        return bff.search(q, category, sort, page, size);
    }

    /** Página de produto: produto + vendedor + relacionados + parcelamento, numa chamada só. */
    @GetMapping("/products/{id}")
    public ProductPageView product(@PathVariable Long id) {
        return bff.productPage(id);
    }
}
