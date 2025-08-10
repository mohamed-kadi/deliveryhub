package com.example.deliveryhub.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransporterProfileDTO {
    private Long id;
    private String fullName;
    private String email;
    private String profileImage;
    private String tier; // BASIC, PREMIUM, PRO
    
    // Rating and performance metrics
    private Double averageRating;
    private Integer totalRatings;
    private Integer completedDeliveries;
    private String responseTime; // e.g., "< 1h"
    private Double successRate; // 0.0 to 1.0
    
    // Additional info
    private List<String> specialties; // e.g., ["Fragile Items", "Express Delivery"]
    private String city;
    private String description;
    private Boolean isVerified;
    private Boolean isAvailable;
    
    // Timestamps
    private LocalDateTime joinedAt;
    private LocalDateTime lastActiveAt;
}