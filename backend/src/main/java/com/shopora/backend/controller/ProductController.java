package com.shopora.backend.controller;

import com.shopora.backend.model.Product;
import com.shopora.backend.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository repo;
    public ProductController(ProductRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Product> all(@RequestParam(required=false) String category) {
        return category == null || category.isBlank() ? repo.findAll() : repo.findByCategoryIgnoreCase(category);
    }

    @GetMapping("/{id}")
    public Product one(@PathVariable Long id) { return repo.findById(id).orElseThrow(); }
}
