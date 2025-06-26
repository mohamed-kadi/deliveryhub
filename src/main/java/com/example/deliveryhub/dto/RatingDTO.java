package com.example.deliveryhub.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RatingDTO {

    @NotNull
    private Long deliveryId;

    @NotNull
    private Long reviewerId;
    
    @NotNull
    private Long revieweeId;

    @Min(1)
    @Max(5)
    private int rating;

    private String feedback;

}
