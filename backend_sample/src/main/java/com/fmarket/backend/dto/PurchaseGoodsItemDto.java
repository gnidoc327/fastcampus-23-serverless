package com.fmarket.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class PurchaseGoodsItemDto {
    private Long userId;
    private Long goodsItemId;
    private Integer quantity;
}
