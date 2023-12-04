package com.fmarket.backend.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class GoodsItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String description;
    private Integer price;
    private String imageTitle;
    private Long imageSize;
    private String imageUri;

    public GoodsItem() {}

    public GoodsItem(String name, String description, Integer price, String imageTitle, Long imageSize, String imageUri) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageTitle = imageTitle;
        this.imageSize = imageSize;
        this.imageUri = imageUri;
    }
}
