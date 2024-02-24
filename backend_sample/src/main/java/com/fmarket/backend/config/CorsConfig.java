package com.fmarket.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*") // 모든 origin 허용, 필요에 따라 특정 origin을 지정할 수 있습니다.
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 요청 허용 메서드
                .allowedHeaders("*"); // 요청 허용 헤더
    }
}
