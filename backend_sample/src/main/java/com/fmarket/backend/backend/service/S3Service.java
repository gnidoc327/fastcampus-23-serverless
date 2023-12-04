package com.fmarket.backend.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {
    @Value("${aws.s3.bucket-name.goods}")
    private String bucketName;

    public String uploadFile(MultipartFile file) throws IOException {
        S3Client s3Client = S3Client.builder().build();
        String fileName = generateUniqueFileName(file.getOriginalFilename());
        s3Client.putObject(PutObjectRequest.builder().bucket(bucketName).key(fileName).build(),
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()) );
        return fileName;
    }

    private String generateUniqueFileName(String originalFileName) {
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        return UUID.randomUUID().toString() + extension;
    }
}