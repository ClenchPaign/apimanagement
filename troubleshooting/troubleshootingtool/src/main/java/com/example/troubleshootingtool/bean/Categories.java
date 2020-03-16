package com.example.troubleshootingtool.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "category"

})
public class Categories {
    @JsonProperty("category")
    private String category;

    @JsonProperty("category")
    public void setCategory(String category) {
        this.category = category;
    }
    @JsonProperty("category")
    public String getCategory() {
        return category;
    }
}
