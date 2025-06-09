package com.example.deliveryhub.dto;

import lombok.Data;

@Data
public class CancelDeliveryRequest {
    private Long deliveryId;
    private String cancelReason;




}
