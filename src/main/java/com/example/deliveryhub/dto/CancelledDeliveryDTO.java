package com.example.deliveryhub.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CancelledDeliveryDTO {
    private Long deliveryId;
    private String pickupCity;
    private String dropoffCity;
    private String customerEmail;
    private LocalDate pickupDate;
    private String cancelReason; // optional, if implemented
}
