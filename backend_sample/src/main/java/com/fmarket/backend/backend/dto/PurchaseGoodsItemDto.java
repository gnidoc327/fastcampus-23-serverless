package com.fmarket.backend.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PurchaseGoodsItemDto {
    private Long userId;
    private Long goodsItemId;
    private Integer quantity;
}
