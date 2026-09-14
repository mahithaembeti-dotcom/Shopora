package com.shopora.backend.controller;

import com.shopora.backend.model.Product;
import com.shopora.backend.model.Order;
import com.shopora.backend.repository.ProductRepository;
import com.shopora.backend.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final ProductRepository products; private final OrderRepository orders;
    public AdminController(ProductRepository products, OrderRepository orders){this.products=products;this.orders=orders;}

    @GetMapping("/orders") public List<Order> orders(){return orders.findAllByOrderByCreatedAtDesc();}
    @PostMapping("/products") public Product create(@RequestBody Product p){return products.save(p);}
    @PutMapping("/products/{id}") public Product update(@PathVariable Long id,@RequestBody Product p){p.setId(id);return products.save(p);}
    @DeleteMapping("/products/{id}") public void delete(@PathVariable Long id){products.deleteById(id);}
}
