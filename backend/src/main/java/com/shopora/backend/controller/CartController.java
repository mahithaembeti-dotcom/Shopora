package com.shopora.backend.controller;

import com.shopora.backend.model.CartItem;
import com.shopora.backend.model.Product;
import com.shopora.backend.repository.CartItemRepository;
import com.shopora.backend.repository.ProductRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartItemRepository carts;
    private final ProductRepository products;
    public CartController(CartItemRepository carts, ProductRepository products) { this.carts=carts; this.products=products; }

    private Long userId(Authentication auth) { return Long.valueOf(auth.getName().hashCode() & 0x7fffffff); }
    // The frontend stores email in the token. We use a stable local user key here only for the cart.
    // A production version should resolve the actual User entity by email.

    @GetMapping
    public List<CartItem> get(Authentication auth) { return carts.findByUserId(userId(auth)); }

    @PostMapping
    public CartItem add(Authentication auth, @RequestBody CartItem input) {
        products.findById(input.getProductId()).orElseThrow();
        Long uid=userId(auth);
        CartItem item=carts.findByUserIdAndProductId(uid,input.getProductId()).orElseGet(CartItem::new);
        item.setUserId(uid); item.setProductId(input.getProductId());
        item.setQuantity(Math.max(1, input.getQuantity()));
        return carts.save(item);
    }

    @DeleteMapping("/{productId}")
    public void remove(Authentication auth, @PathVariable Long productId) {
        carts.findByUserIdAndProductId(userId(auth), productId).ifPresent(carts::delete);
    }
}
