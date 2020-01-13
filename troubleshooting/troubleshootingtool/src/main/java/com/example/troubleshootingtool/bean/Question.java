package com.example.troubleshootingtool.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "questionId",
        "category",
        "question",
        "questionDesc",
        "attachment",
        "postedDate",
        "ownerUserId",
        "ownerUserName",
        "lastEditedDate"
})
public class Question {

    @JsonProperty("questionId")
    private String questionId;
    @JsonProperty("category")
    private String category;
    @JsonProperty("question")
    private String question;
    @JsonProperty("questionDesc")
    private String questionDesc;
    @JsonProperty("attachment")
    private String attachment;
    @JsonProperty("postedDate")
    private String postedDate;
    @JsonProperty("ownerUserId")
    private String ownerUserId;
    @JsonProperty("ownerUserName")
    private String ownerUserName;
    @JsonProperty("lastEditedDate")
    private String lastEditedDate;

    public Question() {}
    public Question(String questionId, String category, String question, String questionDesc, String attachment, String postedDate, String ownerUserId, String ownerUserName, String lastEditedDate) {
        super();
        this.questionId = questionId;
        this.category = category;
        this.question = question;
        this.questionDesc = questionDesc;
        this.attachment = attachment;
        this.postedDate = postedDate;
        this.ownerUserId = ownerUserId;
        this.ownerUserName = ownerUserName;
        this.lastEditedDate = lastEditedDate;
    }

    @JsonProperty("questionId")
    public String getQuestionId() {
        return questionId;
    }

    @JsonProperty("questionId")
    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    @JsonProperty("category")
    public String getCategory() {
        return category;
    }

    @JsonProperty("category")
    public void setCategory(String category) {
        this.category = category;
    }

    @JsonProperty("question")
    public String getQuestion() {
        return question;
    }

    @JsonProperty("question")
    public void setQuestion(String question) {
        this.question = question;
    }

    @JsonProperty("questionDesc")
    public String getQuestionDesc() {
        return questionDesc;
    }

    @JsonProperty("questionDesc")
    public void setQuestionDesc(String questionDesc) {
        this.questionDesc = questionDesc;
    }

    @JsonProperty("attachment")
    public String getAttachment() {
        return attachment;
    }

    @JsonProperty("attachment")
    public void setAttachment(String attachment) {
        this.attachment = attachment;
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

}