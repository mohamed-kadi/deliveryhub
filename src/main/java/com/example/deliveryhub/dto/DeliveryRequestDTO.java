package com.example.deliveryhub.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class DeliveryRequestDTO {

    @NotBlank
    private String pickupCity;

    @NotBlank
    private String dropoffCity;

    @NotBlank
    private String itemType; // e.g., electronics, clothing

    private String description;

    @Future
    private LocalDate pickupDate;
}


