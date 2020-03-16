package com.example.troubleshootingtool.bean;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "user"
})
public class Admin{
    @JsonProperty("user")
    private String user;

    @JsonProperty("user")
    public String getUsername() {
        return user;
    }

    @JsonProperty("user")
    public void setUsername(String user) {
        this.user = user;
    }

}

