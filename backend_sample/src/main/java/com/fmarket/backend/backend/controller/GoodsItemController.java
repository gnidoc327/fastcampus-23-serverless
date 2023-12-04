package com.fmarket.backend.backend.controller;

import com.fmarket.backend.dto.GoodsItemDto;
import com.fmarket.backend.dto.PurchaseGoodsItemDto;
import com.fmarket.backend.entity.GoodsItem;
import com.fmarket.backend.entity.PurchaseHistory;
import com.fmarket.backend.entity.User;
import com.fmarket.backend.repository.GoodsItemRepository;
import com.fmarket.backend.repository.UserRepository;
import com.fmarket.backend.service.DDBService;
import com.fmarket.backend.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/good-items")
public class GoodsItemController {
    @Autowired
    S3Service s3Service;

    @Autowired
    GoodsItemRepository goodsItemRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DDBService ddbService;

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String registerGoodsItem(
            @RequestPart MultipartFile file,
            @RequestPart GoodsItemDto goodsItemDto) throws IOException {
        String fileName = s3Service.uploadFile(file);
        GoodsItem goodsItem = new GoodsItem(
                goodsItemDto.getName(),
                goodsItemDto.getDescription(),
                goodsItemDto.getPrice(),
                file.getOriginalFilename(),
                file.getSize(),
                fileName
        );
        goodsItemRepository.save(goodsItem);
        return "register";
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Optional<GoodsItem> getGoodsItem(Long id) {
        return goodsItemRepository.findById(id);
    }


    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Iterable<GoodsItem> getAllGoodsItems() {
        return goodsItemRepository.findAll();
    }

    @PostMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String purchaseGoodsItem(PurchaseGoodsItemDto purchaseGoodsItemDto) {
        Optional<GoodsItem> goodsItem = goodsItemRepository.findById(purchaseGoodsItemDto.getGoodsItemId());
        Optional<User> user = userRepository.findById(purchaseGoodsItemDto.getUserId());
        if (!goodsItem.isPresent() || !user.isPresent()) {
            throw new RuntimeException("Goods Item or User not found");
        }
        PurchaseHistory purchaseHistory = new PurchaseHistory(
                user.get().getId(),
                new Date(),
                user.get().getUsername(),
                goodsItem.get().getId(),
                goodsItem.get().getName(),
                goodsItem.get().getDescription(),
                goodsItem.get().getPrice(),
                goodsItem.get().getImageTitle(),
                goodsItem.get().getImageUri(),
                purchaseGoodsItemDto.getQuantity(),
                goodsItem.get().getPrice() * purchaseGoodsItemDto.getQuantity(),
                new Date()
        );
        ddbService.putItem(purchaseHistory);
        return "purchaseGoodsItem";
    }
}
