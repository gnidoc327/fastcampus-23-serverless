package com.fmarket.backend.backend.repository;

import com.fmarket.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}