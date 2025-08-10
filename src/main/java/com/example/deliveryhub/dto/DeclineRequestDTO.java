package com.example.deliveryhub.dto;

import com.example.deliveryhub.enums.DeclineReason;

import lombok.Data;

@Data
public class DeclineRequestDTO {
    
    private DeclineReason reason;
    private String customMessage;
}
