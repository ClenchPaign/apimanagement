package com.example.troubleshootingtool.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "id",
        "description",
        "postedDate",
        "ownerUserId",
        "ownerUserName",
        "lastEditedDate",
        "voteCount",
        "isApproved"
})
public class Answer {

    @JsonProperty("id")
    private String id;
    @JsonProperty("description")
    private String description;
    @JsonProperty("postedDate")
    private String postedDate;
    @JsonProperty("ownerUserId")
    private String ownerUserId;
    @JsonProperty("ownerUserName")
    private String ownerUserName;
    @JsonProperty("lastEditedDate")
    private String lastEditedDate;
    @JsonProperty("voteCount")
    private Integer voteCount;
    @JsonProperty("isApproved")
    private Boolean isApproved;

    /**
     * No args constructor for use in serialization
     *
     */
    public Answer() {
    }

    /**
     *
     * @param ownerUserId
     * @param description
     * @param ownerUserName
     * @param lastEditedDate
     * @param id
     * @param voteCount
     * @param isApproved
     * @param postedDate
     */
    public Answer(String id, String description, String postedDate, String ownerUserId, String ownerUserName, String lastEditedDate, Integer voteCount, Boolean isApproved) {
        super();
        this.id = id;
        this.description = description;
        this.postedDate = postedDate;
        this.ownerUserId = ownerUserId;
        this.ownerUserName = ownerUserName;
        this.lastEditedDate = lastEditedDate;
        this.voteCount = voteCount;
        this.isApproved = isApproved;
    }

    @JsonProperty("id")
    public String getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    @JsonProperty("description")
    public void setDescription(String description) {
        this.description = description;
    }

    @JsonProperty("postedDate")
    public String getPostedDate() {
        return postedDate;
    }

    @JsonProperty("postedDate")
    public void setPostedDate(String postedDate) {
        this.postedDate = postedDate;
    }

    @JsonProperty("ownerUserId")
    public String getOwnerUserId() {
        return ownerUserId;
    }

    @JsonProperty("ownerUserId")
    public void setOwnerUserId(String ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    @JsonProperty("ownerUserName")
    public String getOwnerUserName() {
        return ownerUserName;
    }

    @JsonProperty("ownerUserName")
    public void setOwnerUserName(String ownerUserName) {
        this.ownerUserName = ownerUserName;
    }

    @JsonProperty("lastEditedDate")
    public String getLastEditedDate() {
        return lastEditedDate;
    }

    @JsonProperty("lastEditedDate")
    public void setLastEditedDate(String lastEditedDate) {
        this.lastEditedDate = lastEditedDate;
    }

    @JsonProperty("voteCount")
    public Integer getVoteCount() {
        return voteCount;
    }

    @JsonProperty("voteCount")
    public void setVoteCount(Integer voteCount) {
        this.voteCount = voteCount;
    }

    @JsonProperty("isApproved")
    public Boolean getIsApproved() {
        return isApproved;
    }

    @JsonProperty("isApproved")
    public void setIsApproved(Boolean isApproved) {
        this.isApproved = isApproved;
    }

}