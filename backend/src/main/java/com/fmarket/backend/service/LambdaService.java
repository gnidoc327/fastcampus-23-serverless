package com.fmarket.backend.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.services.lambda.model.InvokeResponse;

import java.util.ArrayList;
import java.util.List;

@Service
public class LambdaService {
    private final LambdaClient lambdaClient = LambdaClient.builder()
            .build();

    public List<Long> invokeGoodsRecommand(Long userId, String keyword) {
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("keyword", keyword);
        jsonObj.put("userId", userId);
        String json = jsonObj.toString();
        SdkBytes payload = SdkBytes.fromUtf8String(json) ;

        InvokeRequest request = InvokeRequest.builder()
                .functionName("goods-recommand")
                .payload(payload)
                .build();

        InvokeResponse response = lambdaClient.invoke(request);
        JSONArray array = new JSONArray(response.payload().asUtf8String());
        List<Long> arrayList = new ArrayList<>();
        for (int i=0; i< array.length(); i++) {
            arrayList.add(Long.parseLong(array.get(i).toString()));
        }
        return arrayList;
    }
}
