package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PendingDeliveryAgeDTO {
    private Long deliveryId;
    private String pickupCity;
    private String dropoffCity;
    private String customerEmail;
    private int daysPending;

}
