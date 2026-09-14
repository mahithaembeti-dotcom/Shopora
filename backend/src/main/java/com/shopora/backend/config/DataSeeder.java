package com.shopora.backend.config;

import com.shopora.backend.model.Product;
import com.shopora.backend.model.User;
import com.shopora.backend.repository.ProductRepository;
import com.shopora.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(ProductRepository products, UserRepository users, PasswordEncoder encoder) {
        return args -> {
            if (products.count() == 0) {
                products.saveAll(List.of(
                    product("Wireless Headphones","Comfortable Bluetooth headphones",1999,"Electronics","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",20),
                    product("Smart Watch","Fitness and notification smartwatch",2499,"Electronics","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",15),
                    product("Running Shoes","Lightweight everyday running shoes",2999,"Fashion","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",25),
                    product("Backpack","Durable laptop backpack",1499,"Accessories","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",30),
                    product("Sunglasses","Classic UV-protection sunglasses",999,"Fashion","https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",18),
                    product("Coffee Mug","Minimal ceramic coffee mug",399,"Home","https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",40)
                ));
            }
            if (users.findByEmail("admin@shopora.com").isEmpty()) {
                User u=new User(); u.setName("Shopora Admin"); u.setEmail("admin@shopora.com");
                u.setPassword(encoder.encode("Admin@123")); u.setRole("ADMIN"); users.save(u);
            }
        };
    }

    private Product product(String n,String d,double p,String c,String i,int s){
        Product x=new Product(); x.setName(n);x.setDescription(d);x.setPrice(BigDecimal.valueOf(p));x.setCategory(c);x.setImageUrl(i);x.setStock(s);return x;
    }
}
