package com.example.deliveryhub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.Rating;
import com.example.deliveryhub.model.User;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByDelivery_Id(Long deliveryId);

    List<Rating> findByReviewerId(Long reviewerId);

    List<Rating> findByRevieweeId(Long revieweeId);

    Optional<Rating> findByDeliveryAndReviewer(DeliveryRequest delivery, User reviewer);
    
    boolean existsByDelivery_IdAndReviewerId(Long deliveryId, Long reviewerId);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.reviewee.id = :userId")
    Double findAverageRatingByRevieweeId(@Param("userId") Long userId);


}

