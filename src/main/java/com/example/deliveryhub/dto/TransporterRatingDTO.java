package com.example.deliveryhub.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import java.util.List;



@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransporterRatingDTO {
    private Long transporterId; 
    private String transporterName;
    private String transporterEmail;
    private Double averageRating;
    private Integer totalRatings;
    private List<String> recentFeedback;
}