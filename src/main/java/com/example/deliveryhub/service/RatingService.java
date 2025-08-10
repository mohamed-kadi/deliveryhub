package com.example.deliveryhub.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.example.deliveryhub.dto.CustomerRatingDTO;
import com.example.deliveryhub.dto.RatingDTO;
import com.example.deliveryhub.dto.TransporterRatingDTO;
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
        DeliveryRequest delivery = deliveryRequestRepository.findById(ratingDTO.getDeliveryId())
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        if (!"DELIVERED".equals(delivery.getStatus())) {
            throw new RuntimeException("Can only rate completed deliveries");
        }

        User reviewer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User reviewee = userRepository.findById(ratingDTO.getRevieweeId())
                .orElseThrow(() -> new RuntimeException("Reviewee not found"));

        //validate that the reviewer is part of this delivery
        boolean isValidReviewer = delivery.getCustomer().getId().equals(reviewer.getId())
                || (delivery.getTransporter() != null && delivery.getTransporter().getId().equals(reviewer.getId()));
        
        if (!isValidReviewer) {
            throw new RuntimeException("You are not authorized to rate this delivery");
        }

        // prevent duplicate ratings by the same user for the same delivery
        if (ratingRepository.existsByDelivery_IdAndReviewerId(ratingDTO.getDeliveryId(), reviewer.getId())) {
            throw new RuntimeException("You have already rated this delivery");
        }

        // Ensure sender is either customer or transporter of the same delivery
        if (!reviewer.equals(delivery.getCustomer()) && !reviewer.equals(delivery.getTransporter())) {
            throw new SecurityException("User not authorized to rate this delivery");
        }

        Rating rating = Rating.builder()
                .delivery(delivery)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .revieweeRole(reviewee.getRole())
                .rating(ratingDTO.getRating())
                .feedback(ratingDTO.getFeedback())
                .timestamp(LocalDateTime.now())
                .build();
        return ratingRepository.save(rating);
    }

    public Double getAverageRatingForUser(Long userId) {
        return ratingRepository.findAverageRatingByRevieweeId(userId);
    }

    public boolean canUserRateDelivery(Long deliveryId, Long userId) {
        // Check if delivery is completed
        DeliveryRequest delivery = deliveryRequestRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        
        if (!"DELIVERED".equals(delivery.getStatus())) {
            return false;
        }
        
        // Check if user is either customer or transporter for this delivery
        boolean isParticipant = delivery.getCustomer().getId().equals(userId) || 
                            (delivery.getTransporter() != null && delivery.getTransporter().getId().equals(userId));
        
        if (!isParticipant) {
            return false;
        }
        
            // Check if user hasn't already rated
            return !ratingRepository.existsByDelivery_IdAndReviewerId(deliveryId, userId);
        }

        public Optional<Rating> getMyRatingForDelivery(Long deliveryId, Long userId) {
            DeliveryRequest delivery = deliveryRequestRepository.findById(deliveryId)
                    .orElseThrow(() -> new RuntimeException("Delivery not found"));

            User reviewer = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ratingRepository.findByDeliveryAndReviewer(delivery, reviewer);
        }
    
        public CustomerRatingDTO getCustomerRatingSummary(Long customerId) {
            User customer = userRepository.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            if (customer.getRole() != Role.CUSTOMER) {
                throw new RuntimeException("User is not a customer");
            }
            
            // Use your existing methods
            Long totalRatings = ratingRepository.countByRevieweeId(customerId);
            Double averageRating = ratingRepository.findAverageRatingByRevieweeId(customerId);
            
            if (totalRatings == 0) {
                return CustomerRatingDTO.builder()
                        .customerId(customerId)
                        .customerName(customer.getFullName())
                        .averageRating(0.0)
                        .totalRatings(0)
                        .recentFeedback(Collections.emptyList())
                        .build();
            }
            
            // Get recent feedback
            List<String> recentFeedback = ratingRepository.findTop3ByRevieweeIdOrderByTimestampDesc(customerId)
                    .stream()
                    .filter(r -> r.getFeedback() != null && !r.getFeedback().trim().isEmpty())
                    .map(Rating::getFeedback)
                    .collect(Collectors.toList());
            
            return CustomerRatingDTO.builder()
                    .customerId(customerId)
                    .customerName(customer.getFullName())
                    .averageRating(averageRating != null ? averageRating : 0.0)
                    .totalRatings(totalRatings.intValue())
                    .recentFeedback(recentFeedback)
                    .build();
        }

    
        // Add these methods to your existing RatingService class:

        public Double getAverageRatingForTransporter(Long transporterId) {
            return ratingRepository.findAverageRatingByRevieweeId(transporterId);
        }

        public Integer getTotalRatingsForTransporter(Long transporterId) {
            Long count = ratingRepository.countByRevieweeId(transporterId);
            return count != null ? count.intValue() : 0;
        }

        public TransporterRatingDTO getTransporterRatingSummary(Long transporterId) {
            User transporter = userRepository.findById(transporterId)
                    .orElseThrow(() -> new RuntimeException("Transporter not found"));
            
            if (transporter.getRole() != Role.TRANSPORTER) {
                throw new RuntimeException("User is not a transporter");
            }
            
            // Use your existing methods
            Long totalRatings = ratingRepository.countByRevieweeId(transporterId);
            Double averageRating = ratingRepository.findAverageRatingByRevieweeId(transporterId);
            
            if (totalRatings == 0) {
                return TransporterRatingDTO.builder()
                        .transporterId(transporterId)
                        .transporterName(transporter.getFullName())
                        .transporterEmail(transporter.getEmail())
                        .averageRating(0.0)
                        .totalRatings(0)
                        .recentFeedback(Collections.emptyList())
                        .build();
            }
            
            // Get recent feedback
            List<String> recentFeedback = ratingRepository.findTop3ByRevieweeIdOrderByTimestampDesc(transporterId)
                    .stream()
                    .filter(r -> r.getFeedback() != null && !r.getFeedback().trim().isEmpty())
                    .map(Rating::getFeedback)
                    .collect(Collectors.toList());
            
            return TransporterRatingDTO.builder()
                    .transporterId(transporterId)
                    .transporterName(transporter.getFullName())
                    .transporterEmail(transporter.getEmail())
                    .averageRating(averageRating != null ? averageRating : 0.0)
                    .totalRatings(totalRatings.intValue())
                    .recentFeedback(recentFeedback)
                    .build();
        }
    

}
