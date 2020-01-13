package com.example.troubleshootingtool.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "ansId",
        "answerDesc",
        "postedDate",
        "ownerUserId",
        "ownerUserName",
        "lastEditedDate",
        "vote",
        "isApproved"
})
public class Answer {

    @JsonProperty("ansId")
    private String ansId;
    @JsonProperty("answerDesc")
    private String answerDesc;
    @JsonProperty("postedDate")
    private String postedDate;
    @JsonProperty("ownerUserId")
    private String ownerUserId;
    @JsonProperty("ownerUserName")
    private String ownerUserName;
    @JsonProperty("lastEditedDate")
    private String lastEditedDate;
    @JsonProperty("vote")
    private Integer vote;
    @JsonProperty("isApproved")
    private Boolean isApproved;
    public Answer() {}
    public Answer(String ansId, String answerDesc, String postedDate, String ownerUserId, String ownerUserName, String lastEditedDate, Integer vote, Boolean isApproved) {
        super();
        this.ansId = ansId;
        this.answerDesc = answerDesc;
        this.postedDate = postedDate;
        this.ownerUserId = ownerUserId;
        this.ownerUserName = ownerUserName;
        this.lastEditedDate = lastEditedDate;
        this.vote = vote;
        this.isApproved = isApproved;
    }

    @JsonProperty("ansId")
    public String getAnsId() {
        return ansId;
    }

    @JsonProperty("ansId")
    public void setAnsId(String ansId) {
        this.ansId = ansId;
    }

    @JsonProperty("answerDesc")
    public String getAnswerDesc() {
        return answerDesc;
    }

    @JsonProperty("answerDesc")
    public void setAnswerDesc(String answerDesc) {
        this.answerDesc = answerDesc;
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

    @JsonProperty("vote")
    public Integer getVote() {
        return vote;
    }

    @JsonProperty("vote")
    public void setVote(Integer vote) {
        this.vote = vote;
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