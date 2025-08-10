package com.example.deliveryhub.dto;

import java.util.List;
import lombok.Data;

@Data
public class TransporterMarketplaceDTO {
    private Long id;
    private String fullName;
    private String email;
    
    // Pricing info
    private Double ratePerKg;
    private Double fixedPriceUnderThreshold;
    private Double weightThreshold;
    private String currency;
    
    // Rating info (using your system!)
    private Double averageRating;
    private Long totalRatings;
    private List<String> recentFeedback; // Latest 3-5 reviews
    
    // Additional marketplace info
    private String profileDescription;
    private Integer completedDeliveries;
    private Boolean verified;

}
