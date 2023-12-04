package com.fmarket.backend.backend.repository;

import com.fmarket.backend.entity.GoodsItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoodsItemRepository extends JpaRepository<GoodsItem, Long> {
}
