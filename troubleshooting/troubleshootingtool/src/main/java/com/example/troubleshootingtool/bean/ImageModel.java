package com.example.troubleshootingtool.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "id",
        "fileName",
        "base64Image"
})
public class ImageModel {
    @JsonProperty("id")
    private String id;
    @JsonProperty("fileName")
    private String fileName;
    @JsonProperty("base64Image")
    private String base64Image;

    public ImageModel(){}

    public ImageModel(String id, String fileName,String base64Image) {
        super();
        this.id = id;
        this.fileName = fileName;
        this.base64Image = base64Image;
    }

    @JsonProperty("id")
    public String getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    @JsonProperty("fileName")
    public String getFileName() {
        return fileName;
    }

    @JsonProperty("fileName")
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @JsonProperty("base64Image")
    public String getBase64Image() {
        return base64Image;
    }

    @JsonProperty("base64Image")
    public void setBase64Image(String base64Image) {
        this.base64Image = base64Image;
    }
}
