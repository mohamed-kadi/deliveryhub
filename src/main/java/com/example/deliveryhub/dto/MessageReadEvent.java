package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageReadEvent {

    private Long messageId;
    private Long deliveryId; // optional but useful if you want frontend to scope updates



}
