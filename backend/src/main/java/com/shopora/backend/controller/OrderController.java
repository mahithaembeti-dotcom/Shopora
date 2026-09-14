package com.shopora.backend.controller;

import com.shopora.backend.model.*;
import com.shopora.backend.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orders; private final CartItemRepository carts; private final ProductRepository products;
    public OrderController(OrderRepository orders, CartItemRepository carts, ProductRepository products) { this.orders=orders;this.carts=carts;this.products=products; }
    private Long uid(Authentication a){return Long.valueOf(a.getName().hashCode() & 0x7fffffff);}

    @PostMapping
    public Order place(Authentication auth) {
        Long user=uid(auth); List<CartItem> cart=carts.findByUserId(user);
        if(cart.isEmpty()) throw new IllegalStateException("Cart is empty");
        Order order=new Order(); order.setUserId(user); BigDecimal total=BigDecimal.ZERO;
        for(CartItem ci:cart){
            Product p=products.findById(ci.getProductId()).orElseThrow();
            if(p.getStock()!=null && p.getStock()<ci.getQuantity()) throw new IllegalStateException("Insufficient stock for "+p.getName());
            OrderItem oi=new OrderItem(); oi.setProductId(p.getId()); oi.setProductName(p.getName()); oi.setPrice(p.getPrice()); oi.setQuantity(ci.getQuantity());
            order.getItems().add(oi); total=total.add(p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
            if(p.getStock()!=null) p.setStock(p.getStock()-ci.getQuantity()); products.save(p);
        }
        order.setTotal(total); Order saved=orders.save(order); carts.deleteAll(cart); return saved;
    }

    @GetMapping("/my")
    public List<Order> my(Authentication auth){ return orders.findByUserIdOrderByCreatedAtDesc(uid(auth)); }
}
