package com.example.troubleshootingtool.bean;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "category",
        "tags",
        "keyword"
})
public class SearchQuery {

    @JsonProperty("tags")
    private List<String> tags = null;
    @JsonProperty("category")
    private String category;
    @JsonProperty("keyword")
    private List<String> keyword = null;

    /**
     * No args constructor for use in serialization
     *
     */
    public SearchQuery() {
    }

    /**
     *
     * @param category
     * @param keyword
     * @param tags
     */
    public SearchQuery(List<String> tags, String category, List<String> keyword) {
        super();
        this.tags = tags;
        this.category = category;
        this.keyword = keyword;
    }

    @JsonProperty("tags")
    public List<String> getTags() {
        return tags;
    }

    @JsonProperty("tags")
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    @JsonProperty("category")
    public String getCategory() {
        return category;
    }

    @JsonProperty("category")
    public void setCategory(String category) {
        this.category = category;
    }

    @JsonProperty("keyword")
    public List<String> getKeyword() {
        return keyword;
    }

    @JsonProperty("keyword")
    public void setKeyword(List<String> keyword) {
        this.keyword = keyword;
    }

}