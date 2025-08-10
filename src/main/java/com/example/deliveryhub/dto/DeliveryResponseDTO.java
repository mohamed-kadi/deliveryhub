package com.example.deliveryhub.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private String customerName;
    private String transporterName;
    private String cancelReason;

    // Fields for decline reason and message
    private String declineReason;
    private String declineMessage;
    private LocalDateTime declinedAt;
    private Boolean declineDismissed;

    // Add these fields for rating system
    private Long customerId;
    private Long transporterId;
    private Double weightKg;

    private LocalDateTime requestedAt;
    private LocalDateTime acceptedAt;
}


