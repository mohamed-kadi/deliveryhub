package com.example.deliveryhub.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import com.example.deliveryhub.dto.TransporterMarketplaceDTO;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.DeliveryRequestRepository;
import com.example.deliveryhub.repository.RatingRepository;
import com.example.deliveryhub.repository.TransporterPricingRepository;
import com.example.deliveryhub.repository.UserRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class TransporterMarketplaceService {

    private final UserRepository userRepository;
    private final TransporterPricingRepository transporterPricingRepository;
    private final RatingRepository ratingRepository;
    private final DeliveryRequestRepository deliveryRequestRepository;

    public List<TransporterMarketplaceDTO> getAvailableTransporters() {
        List<User> transporters = userRepository.findByRoleAndVerifiedAndAvailableForDeliveries(
            Role.TRANSPORTER, true, true);

        return transporters.stream()
            .filter(this::isEligibleTransporter)
            .map(this::mapToMarketplaceDTO)
            .filter(dto -> dto.getRatePerKg() != null)
            .collect(Collectors.toList());
    }

    public Optional<TransporterMarketplaceDTO> getTransporterDetails(Long transporterId) {
        return userRepository.findById(transporterId)
            .filter(this::isEligibleTransporter)
            .map(this::mapToMarketplaceDTO);
    }

    public Double calculateEstimatedCost(Long transporterId, Double weightKg) {
        if (weightKg == null) return 0.0;

        Optional<User> transporterOpt = userRepository.findById(transporterId);
        if (transporterOpt.isEmpty()) return 0.0;

        return transporterPricingRepository.findByTransporter(transporterOpt.get())
            .map(pricing -> weightKg <= pricing.getWeightThreshold()
                ? pricing.getFixedPriceUnderThreshold()
                : weightKg * pricing.getRatePerKg())
            .orElse(0.0);
    }

    // ======================== PRIVATE HELPERS ========================

    private boolean isEligibleTransporter(User user) {
        return user.getRole() == Role.TRANSPORTER && user.isVerified();
    }

    private TransporterMarketplaceDTO mapToMarketplaceDTO(User transporter) {
        TransporterMarketplaceDTO dto = new TransporterMarketplaceDTO();
        dto.setId(transporter.getId());
        dto.setFullName(transporter.getFullName());
        dto.setEmail(transporter.getEmail());
        dto.setVerified(transporter.isVerified());

        setPricingDetails(transporter, dto);
        setRatingDetails(transporter, dto);
        setDeliveryStats(transporter, dto);

        return dto;
    }

    private void setPricingDetails(User transporter, TransporterMarketplaceDTO dto) {
        transporterPricingRepository.findByTransporter(transporter).ifPresent(pricing -> {
            dto.setRatePerKg(pricing.getRatePerKg());
            dto.setFixedPriceUnderThreshold(pricing.getFixedPriceUnderThreshold());
            dto.setWeightThreshold(pricing.getWeightThreshold());
            dto.setCurrency(pricing.getCurrency());
        });
    }

    private void setRatingDetails(User transporter, TransporterMarketplaceDTO dto) {
        Double avgRating = ratingRepository.findAverageRatingByRevieweeId(transporter.getId());
        dto.setAverageRating(avgRating != null ? avgRating : 0.0);

        Long totalRatings = ratingRepository.countByRevieweeId(transporter.getId());
        dto.setTotalRatings(totalRatings != null ? totalRatings : 0L);

        List<String> feedback = ratingRepository.findTop3ByRevieweeIdOrderByTimestampDesc(transporter.getId())
            .stream()
            .map(r -> r.getFeedback())
            .filter(f -> f != null && !f.trim().isEmpty())
            .collect(Collectors.toList());
        dto.setRecentFeedback(feedback);
    }

    private void setDeliveryStats(User transporter, TransporterMarketplaceDTO dto) {
        Long completedDeliveries = deliveryRequestRepository.countByTransporterAndStatus(transporter, "DELIVERED");
        dto.setCompletedDeliveries(completedDeliveries != null ? completedDeliveries.intValue() : 0);
    }
}
