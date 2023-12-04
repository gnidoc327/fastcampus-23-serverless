package com.fmarket.backend.backend.controller;

import com.fmarket.backend.entity.PurchaseHistory;
import com.fmarket.backend.service.DDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

///purchase-list?startDate=startDate&endDate=endDate
@RestController
@RequestMapping("/purchase-list")
public class PurchaseController {
    @Autowired
    DDBService ddbService;

    @GetMapping(value = "/{userId}/{createdAt}")
    public PurchaseHistory getPurchaseHistory(@PathVariable("userId") Long userId, @PathVariable("createdAt") Long createdAt){
        return ddbService.getItem(userId, createdAt);
    }

    @GetMapping(value = "/{userId}")
    public List<PurchaseHistory> getPurchaseHistories(@PathVariable("userId") Long userId){
        return ddbService.getItems(userId);
    }
}
