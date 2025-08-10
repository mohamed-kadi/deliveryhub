package com.example.deliveryhub.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;


@Data
public class DeliveryRequestDTO {

    private Long transporterId;

    @NotBlank
    private String pickupCity;

    @NotBlank
    private String dropoffCity;

    @NotBlank
    private String itemType; // e.g., electronics, clothing

    private String description;

    @NotNull
    @Positive
    private Double weightKg;

    @Future
    private LocalDate pickupDate;
}


