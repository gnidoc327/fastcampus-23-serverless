package com.fmarket.backend.controller;

import com.fmarket.backend.dto.GoodsItemDto;
import com.fmarket.backend.dto.PurchaseGoodsItemDto;
import com.fmarket.backend.entity.GoodsItem;
import com.fmarket.backend.entity.PurchaseHistory;
import com.fmarket.backend.entity.User;
import com.fmarket.backend.repository.GoodsItemRepository;
import com.fmarket.backend.repository.UserRepository;
import com.fmarket.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/recommanded-goods-items")
public class RecommandGoodsItemController {
    @Autowired
    GoodsItemRepository goodsItemRepository;

    @Autowired
    LambdaService lambdaService;

    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Iterable<GoodsItem> getAllGoodsItems(@RequestParam(required = false) String keyword, @RequestParam Long userId) throws IOException {
        return goodsItemRepository.findAllById(lambdaService.invokeGoodsRecommand(userId, keyword));
    }
}
