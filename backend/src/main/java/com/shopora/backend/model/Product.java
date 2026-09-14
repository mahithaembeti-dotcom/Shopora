package com.shopora.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(length = 2000) private String description;
    @Column(nullable = false) private BigDecimal price;
    private String imageUrl;
    private String category;
    private Integer stock = 0;
}
