package com.example.deliveryhub.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
// DeliveryResponseDTO is used to send delivery request details back to the client
// after a delivery request has been created or retrieved.
// It includes the delivery request ID, pickup and dropoff cities, item type,
// description, pickup date, status, and customer email.
public class DeliveryResponseDTO {
    private Long id;
    private String pickupCity;
    private String dropoffCity;
    private String itemType;
    private String description;
    private LocalDate pickupDate;
    private String status;
    private String customerEmail;
    private String transportEmail;
}


