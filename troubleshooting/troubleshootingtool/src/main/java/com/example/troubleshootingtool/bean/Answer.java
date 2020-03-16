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
        "attachment",
        "voteCount",
        "isApproved"
})
public class Answer {

    @JsonProperty("id")
    private String id;
    @JsonProperty("description")
    private String description;
    @JsonProperty("postedDate")
    private long postedDate;
    @JsonProperty("ownerUserId")
    private String ownerUserId;
    @JsonProperty("ownerUserName")
    private String ownerUserName;
    @JsonProperty("lastEditedDate")
    private long lastEditedDate;
    @JsonProperty("attachment")
    private String attachment;
    @JsonProperty("voteCount")
    private Integer voteCount;
    @JsonProperty("isApproved")
    private Boolean isApproved;

    public Answer() {
    }

    public Answer(String id, String description, long postedDate, String ownerUserId, String ownerUserName,
                  long lastEditedDate,String attachment, Integer voteCount, Boolean isApproved) {
        super();
        this.id = id;
        this.description = description;
        this.postedDate = postedDate;
        this.ownerUserId = ownerUserId;
        this.ownerUserName = ownerUserName;
        this.lastEditedDate = lastEditedDate;
        this.attachment = attachment;
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
    public long getPostedDate() {
        return postedDate;
    }

    @JsonProperty("postedDate")
    public void setPostedDate(long postedDate) {
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
    public long getLastEditedDate() {
        return lastEditedDate;
    }

    @JsonProperty("lastEditedDate")
    public void setLastEditedDate(long lastEditedDate) {
        this.lastEditedDate = lastEditedDate;
    }

    @JsonProperty("attachment")
    public String getAttachment() {
        return attachment;
    }

    @JsonProperty("attachment")
    public void setAttachment(String attachment) {
        this.attachment = attachment;
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