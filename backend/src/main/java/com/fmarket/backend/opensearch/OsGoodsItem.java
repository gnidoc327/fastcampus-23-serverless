package com.fmarket.backend.opensearch;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class OsGoodsItem {
    @JsonProperty("hits")
    public Hits1 hits1;

    public static class Hits1 {
        @JsonProperty("hits")
        public List<Hits2> hits2;

    }

    public static class Hits2 {
        @JsonProperty("_id")
        public Long id;

    }
}
