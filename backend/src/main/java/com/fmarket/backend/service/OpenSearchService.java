package com.fmarket.backend.service;

import com.fmarket.backend.entity.GoodsItem;
import com.fmarket.backend.opensearch.OsGoodsItem;
import com.fmarket.backend.repository.GoodsItemRepository;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

@Service
public class OpenSearchService {
    @Value("${opensearch.endpoint}")
    private String openSearchEndpoint;

    @Value("${opensearch.username}")
    private String username;

    @Value("${opensearch.password}")
    private String password;

    @Autowired
    private GoodsItemRepository goodsItemRepository;

    public List<GoodsItem> search(String keyword) throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
        SSLContext sslContext = SSLContextBuilder
                .create()
                .loadTrustMaterial(new TrustSelfSignedStrategy())
                .build();
        ClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory() {
            @Override
            protected void prepareConnection(java.net.HttpURLConnection connection, String httpMethod) throws IOException {
                if (connection instanceof javax.net.ssl.HttpsURLConnection) {
                    ((javax.net.ssl.HttpsURLConnection) connection).setSSLSocketFactory(sslContext.getSocketFactory());
                    ((javax.net.ssl.HttpsURLConnection) connection).setHostnameVerifier(NoopHostnameVerifier.INSTANCE);
                }
                super.prepareConnection(connection, httpMethod);
            }
        };
        RestTemplate restTemplate = new RestTemplate(requestFactory);
        restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor(username, password));
        String searchEndpoint = openSearchEndpoint + "/fmarket/_search";
        String requestBody = "{ \"_source\": [\"id\"], \"query\": { \"bool\": { \"should\": [ { \"match\": { \"name\": \"" + keyword + "\" } }, { \"match\": { \"description\": \"" + keyword + "\" } } ] } } }";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<OsGoodsItem> response = restTemplate.exchange(searchEndpoint, HttpMethod.POST, requestEntity, OsGoodsItem.class);
        OsGoodsItem osGoodsItem = response.getBody();
        ArrayList<Long> arrayList = new ArrayList<>();
        for (var hits : osGoodsItem.hits1.hits2) {
            arrayList.add(hits.id);
        }
        return goodsItemRepository.findAllById(arrayList);
    }
}