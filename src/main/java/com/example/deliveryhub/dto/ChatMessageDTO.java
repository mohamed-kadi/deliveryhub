package com.example.deliveryhub.dto;

import java.time.LocalDateTime;

import com.example.deliveryhub.enums.MessageType;
import com.example.deliveryhub.model.Role;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {

    private Long id;

    @NotNull
    private Long matchId; // clearer name for deliveryId

    @NotNull
    private Long senderId;

    @NotBlank
    private String senderName;
    
    @NotNull
    private Role senderRole;

    @NotBlank
    private String content;

    @Builder.Default
    private MessageType messageType = MessageType.CHAT;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime timestamp;

    private String fileUrl;
    private String fileName;

    private Double latitude;
    private Double longitude;

    @Builder.Default
    private Boolean isRead = false;

    @Builder.Default
    private Boolean isDelivered = false;
}

