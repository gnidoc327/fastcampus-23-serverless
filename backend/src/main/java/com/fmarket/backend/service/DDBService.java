package com.fmarket.backend.service;

import com.fmarket.backend.entity.PurchaseHistory;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.*;

@Service
public class DDBService {
    private final String tableName = "purchase-history";

    public void putItem(PurchaseHistory purchaseHistory) {
        DynamoDbClient dynamoDbClient = DynamoDbClient.builder().build();
        PutItemRequest putItemRequest = PutItemRequest.builder()
                .tableName(tableName)
                .item(purchaseHistory.toDDBItem())
                .build();
        dynamoDbClient.putItem(putItemRequest);
    }

    public PurchaseHistory getItem(Long userId, Long createdAt) {
        DynamoDbClient dynamoDbClient = DynamoDbClient.builder().build();
        Map<String, AttributeValue> keyToGet = new HashMap<>();
        keyToGet.put("user_id", AttributeValue.builder().s(String.valueOf(userId)).build()); // 파티션 키
        keyToGet.put("created_at", AttributeValue.builder().n(String.valueOf(createdAt)).build()); // 정렬 키

        GetItemRequest getItemRequest = GetItemRequest.builder()
                .tableName(tableName)
                .key(keyToGet)
                .build();

        GetItemResponse getItemResponse = dynamoDbClient.getItem(getItemRequest);
        return PurchaseHistory.fromDDBItem(getItemResponse.item());
    }

    public List<PurchaseHistory> getItems(Long userId) {
        DynamoDbClient dynamoDbClient = DynamoDbClient.builder().build();
        // Query 조건 설정
        Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
        expressionAttributeValues.put(":userId", AttributeValue.builder().s(String.valueOf(userId)).build());

        QueryRequest queryRequest = QueryRequest.builder()
                .tableName(tableName)
                .keyConditionExpression("user_id = :userId")
                .expressionAttributeValues(expressionAttributeValues)
                .build();

        QueryResponse queryResponse = dynamoDbClient.query(queryRequest);
        ArrayList<PurchaseHistory> purchaseHistories = new ArrayList<>();
        queryResponse.items().forEach(item -> {
            purchaseHistories.add(PurchaseHistory.fromDDBItem(item));
        });
        return purchaseHistories;
    }
}
