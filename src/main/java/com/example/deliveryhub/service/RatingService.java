package com.example.deliveryhub.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.deliveryhub.dto.RatingDTO;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.Rating;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.DeliveryRequestRepository;
import com.example.deliveryhub.repository.RatingRepository;
import com.example.deliveryhub.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final DeliveryRequestRepository deliveryRequestRepository;
    private final UserRepository userRepository;

    public Rating submitRating(RatingDTO ratingDTO, String userEmail) {
        DeliveryRequest delivery = deliveryRequestRepository.findById(ratingDTO.getDeliveryId()).orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        if (delivery.getDeliveredAt() == null ) {
            throw new IllegalStateException("Cannot rate an undelivered request");
        }

        User reviewer = userRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Ensure sender is either customer or transporter of the same delivery
        if(!reviewer.equals(delivery.getCustomer()) && !reviewer.equals(delivery.getTransporter())) {
            throw new SecurityException("User not authorized to rate this delivery");
        }

        User reviewee = reviewer.equals(delivery.getCustomer()) ? delivery.getTransporter() : delivery.getCustomer();

        Role revieweeRole = reviewee.getRole(); // Can be CUSTOMER or TRANSPORTER 

        // Prevent duplicate ratings by same user for same delivery
        Optional<Rating> existingRating = ratingRepository.findByDeliveryAndReviewer(delivery, reviewer);
        if (existingRating.isPresent()) {
            throw new IllegalStateException("You have already rated this delivery");
        }

        Rating rating = Rating.builder()
                .delivery(delivery)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .revieweeRole(revieweeRole)
                .rating(ratingDTO.getRating())
                .feedback(ratingDTO.getFeedback())
                .timestamp(LocalDateTime.now())
                .build();
            return ratingRepository.save(rating);
    }

    public Double getAverageRatingForUser(Long userId) {
        return ratingRepository.findAverageRatingByRevieweeId(userId);
    }
    
    

}
