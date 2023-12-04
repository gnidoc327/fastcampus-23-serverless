package com.fmarket.backend.backend.entity;


import lombok.Getter;
import lombok.Setter;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class PurchaseHistory {
    private Long userId;
    private Date createdAt;

    private String username;

    private Long goodsItemId;
    private String name;
    private String description;
    private Integer price;
    private String imageTitle;
    private String imageUri;

    private Integer quantity;
    private Integer totalPrice;

    private Date updatedAt;

    public PurchaseHistory() {
    }

    public PurchaseHistory(Long userId, Date createdAt, String username, Long goodsItemId,
                           String name, String description, Integer price, String imageTitle, String imageUri,
                           Integer quantity, Integer totalPrice, Date updatedAt) {
        this.userId = userId;
        this.createdAt = createdAt;
        this.username = username;
        this.goodsItemId = goodsItemId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageTitle = imageTitle;
        this.imageUri = imageUri;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.updatedAt = updatedAt;
    }

    public Map<String, AttributeValue> toDDBItem() {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("user_id", AttributeValue.builder().s(String.valueOf(this.userId)).build());
        item.put("created_at", AttributeValue.builder().n(String.valueOf(this.createdAt.getTime())).build());
        item.put("username", AttributeValue.builder().s(this.username).build());
        item.put("goods_item_id", AttributeValue.builder().s(String.valueOf(this.goodsItemId)).build());
        item.put("name", AttributeValue.builder().s(this.name).build());
        item.put("description", AttributeValue.builder().s(this.description).build());
        item.put("price", AttributeValue.builder().n(String.valueOf(this.price)).build());
        item.put("image_title", AttributeValue.builder().s(this.imageTitle).build());
        item.put("image_uri", AttributeValue.builder().s(this.imageUri).build());
        item.put("quantity", AttributeValue.builder().n(String.valueOf(this.quantity)).build());
        item.put("total_price", AttributeValue.builder().n(String.valueOf(this.totalPrice)).build());
        item.put("updated_at", AttributeValue.builder().n(String.valueOf(this.updatedAt.getTime())).build());
        return item;
    }

    public static PurchaseHistory fromDDBItem(Map<String, AttributeValue> item) {
        return new PurchaseHistory(Long.parseLong(item.get("user_id").s()),
                new Date(Long.parseLong(item.get("created_at").n())), item.get("username").s(),
                Long.parseLong(item.get("goods_item_id").s()), item.get("name").s(), item.get("description").s(),
                Integer.parseInt(item.get("price").n()), item.get("image_title").s(), item.get("image_uri").s(),
                Integer.parseInt(item.get("quantity").n()), Integer.parseInt(item.get("total_price").n()),
                new Date(Long.parseLong(item.get("updated_at").n())));
    }
}
