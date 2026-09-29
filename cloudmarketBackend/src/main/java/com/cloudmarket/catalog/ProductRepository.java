package com.cloudmarket.catalog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Busca simples por título e categoria.
     * Parâmetros vazios ("") significam "sem filtro" (evita problemas de tipo com NULL no Postgres).
     */
    @Query("""
            select p from Product p
            where lower(p.title) like lower(concat('%', :q, '%'))
              and (:category = '' or p.category.slug = :category)
            """)
    Page<Product> search(@Param("q") String q, @Param("category") String category, Pageable pageable);

    List<Product> findTop8ByOrderBySoldCountDesc();

    List<Product> findTop8ByFreeShippingTrueOrderByRatingDesc();

    @Query("""
            select p from Product p
            where p.originalPrice is not null and p.originalPrice > p.price
            order by (p.originalPrice - p.price) / p.originalPrice desc
            """)
    List<Product> findBestDeals(Pageable pageable);

    List<Product> findTop6ByCategoryIdAndIdNotOrderBySoldCountDesc(Long categoryId, Long excludeId);

    long countBySellerId(Long sellerId);
}
