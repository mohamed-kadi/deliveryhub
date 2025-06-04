package com.example.deliveryhub.dto;

import lombok.Data;

@Data
public class DeliveryStatusUpdateDTO {
    private String status; // e.g., "PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"
}
