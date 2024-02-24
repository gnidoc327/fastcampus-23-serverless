package com.fmarket.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.CreateQueueRequest;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

@Service
public class SQSService {
    @Value("${cloud.aws.sqs.queue.url}")
    private String queueUrl;

    public void sendMessage(Long goodsItemId, String username) {
        String message = goodsItemId + "/" + username;
        SqsClient sqsClient = SqsClient.builder().build();
        SendMessageRequest sendMsgRequest = SendMessageRequest.builder()
                .queueUrl(this.queueUrl)
                .messageBody(message)
                .delaySeconds(0)
                .build();
        sqsClient.sendMessage(sendMsgRequest);
    }
}
