package com.example.deliveryhub.dto;

import lombok.Data;

@Data
public class AdminDeliveryViewDTO {
    private Long id;
    private String pickupCity;
    private String dropoffCity;
    private String itemType;
    private String status;
    private String customerName;
    private String transporterName;
    

}
