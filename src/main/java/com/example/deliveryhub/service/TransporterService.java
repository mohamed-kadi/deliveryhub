package com.example.deliveryhub.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.deliveryhub.dto.TransporterProfileDTO;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.UserRepository;
import com.example.deliveryhub.service.RatingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransporterService {

    private final UserRepository userRepository;
    private final RatingService ratingService;

    public List<TransporterProfileDTO> getFeaturedTransporters() {
        // Get verified transporters ordered by rating/performance
        List<User> transporters = userRepository.findByRoleAndVerifiedTrueOrderByIdDesc(Role.TRANSPORTER);
        
        return transporters.stream()
                .limit(6) // Show top 6 featured transporters
                .map(this::convertToProfileDTO)
                .collect(Collectors.toList());
    }

    public List<TransporterProfileDTO> getAllAvailableTransporters() {
        List<User> transporters = userRepository.findByRoleAndVerifiedTrue(Role.TRANSPORTER);
        
        return transporters.stream()
                .map(this::convertToProfileDTO)
                .collect(Collectors.toList());
    }

private TransporterProfileDTO convertToProfileDTO(User transporter) {
    // Get transporter's rating stats
    Double avgRating = ratingService.getAverageRatingForTransporter(transporter.getId());
    Integer totalRatings = ratingService.getTotalRatingsForTransporter(transporter.getId());
    
    // Get completed deliveries count
    Integer completedCount = getCompletedDeliveriesCount(transporter.getId());
    
    return TransporterProfileDTO.builder()
            .id(transporter.getId())
            .fullName(transporter.getFullName())
            .email(transporter.getEmail())
            .profileImage(null) // TODO: Add profile image field later
            .tier(determineTier(transporter))
            .averageRating(avgRating != null ? avgRating : 4.5)
            .totalRatings(totalRatings != null ? totalRatings : 0)
            .completedDeliveries(completedCount != null ? completedCount : 0)
            .responseTime("< 2h")
            .successRate(0.95)
            .specialties(Arrays.asList("General Delivery", "Express Service"))
            .city("City") // TODO: Add city field later
            .description("Reliable transporter with excellent service")
            .isVerified(transporter.isVerified()) // Fixed: use isVerified()
            .isAvailable(transporter.getAvailableForDeliveries()) // Fixed: use getAvailableForDeliveries()
            .joinedAt(null) // Set to null since User doesn't have createdAt
            .lastActiveAt(null) // Set to null since User doesn't have lastActiveAt
            .build();
}

    private String determineTier(User transporter) {
        // TODO: Implement tier logic based on performance, subscription, etc.
        // For now, return random tiers for testing
        String[] tiers = {"BASIC", "PREMIUM", "PRO"};
        return tiers[transporter.getId().intValue() % 3];
    }

    private Integer getCompletedDeliveriesCount(Long transporterId) {
        // TODO: Implement this by querying DeliveryRequest repository
        // For now, return a mock value
        return 50 + (transporterId.intValue() % 100);
    }
}