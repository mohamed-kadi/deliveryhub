package com.example.deliveryhub.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRatingDTO {
    private Long customerId;
    private String customerName;
    private Double averageRating;
    private Integer totalRatings;
    private List<String> recentFeedback;

}
