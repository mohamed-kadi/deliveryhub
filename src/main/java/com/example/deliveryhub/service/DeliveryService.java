package com.example.deliveryhub.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.deliveryhub.dto.DeclineRequestDTO;
import com.example.deliveryhub.dto.DeliveryApplicationDTO;
import com.example.deliveryhub.dto.DeliveryRequestDTO;
import com.example.deliveryhub.dto.DeliveryResponseDTO;
import com.example.deliveryhub.enums.ApplicationStatus;
import com.example.deliveryhub.model.DeliveryApplication;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.TransporterPricing;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.DeliveryApplicationRepository;
import com.example.deliveryhub.repository.DeliveryRequestRepository;
import com.example.deliveryhub.repository.RatingRepository;
import com.example.deliveryhub.repository.TransporterPricingRepository;
import com.example.deliveryhub.repository.UserRepository;
import com.example.deliveryhub.util.SecurityUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRequestRepository deliveryRequestRepository;
    private final DeliveryApplicationRepository deliveryApplicationRepository;
    private final TransporterPricingRepository transporterPricingRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final SecurityUtils securityUtils;

    public DeliveryResponseDTO createRequest(DeliveryRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DeliveryRequest request = new DeliveryRequest();
        request.setPickupCity(dto.getPickupCity());
        request.setDropoffCity(dto.getDropoffCity());
        request.setItemType(dto.getItemType());
        request.setDescription(dto.getDescription());
        request.setPickupDate(dto.getPickupDate());
        request.setCustomer(customer);
        request.setWeightKg(dto.getWeightKg());
        
        // Handle direct transporter assignment (marketplace selection)
        if (dto.getTransporterId() != null) {
                User selectedTransporter = userRepository.findById(dto.getTransporterId())
                .orElseThrow(() -> new RuntimeException("Selected transporter not found"));
                request.setTransporter(selectedTransporter);
                request.setStatus("REQUESTED"); // changed from assigne to requested
                request.setRequestedAt(LocalDateTime.now());
        } else {
                request.setStatus("PENDING"); // Old flow - any transporter can accept
        }

        DeliveryRequest saved = deliveryRequestRepository.save(request);

        return new DeliveryResponseDTO(
                saved.getId(),
                saved.getPickupCity(),
                saved.getDropoffCity(),
                saved.getItemType(),
                saved.getDescription(),
                saved.getPickupDate(),
                saved.getStatus(),
                saved.getCustomer().getEmail(),
                saved.getTransporter() != null ? saved.getTransporter().getEmail() : null,
                saved.getCustomer().getFullName(),
                saved.getTransporter() != null ? saved.getTransporter().getFullName() : null,
                saved.getCancelReason(),
                saved.getDeclineReason() != null ? saved.getDeclineReason().toString() : null,
                saved.getDeclineMessage(),
                saved.getDeclinedAt(),
                saved.getDeclineDismissed(),
                saved.getCustomer().getId(),
                saved.getTransporter() != null ? saved.getTransporter().getId() : null,
                saved.getWeightKg(),
                saved.getRequestedAt(),
                saved.getAcceptedAt()
        );
    }
    
    public List<DeliveryResponseDTO> getMyRequests() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<DeliveryRequest> requests = deliveryRequestRepository.findByCustomer(user);

        return requests.stream()
                .map(req -> new DeliveryResponseDTO(
                        req.getId(),
                        req.getPickupCity(),
                        req.getDropoffCity(),
                        req.getItemType(),
                        req.getDescription(),
                        req.getPickupDate(),
                        req.getStatus(),
                        req.getCustomer().getEmail(),
                        req.getTransporter() != null ? req.getTransporter().getEmail() : null,
                        req.getCustomer().getFullName(),
                        req.getTransporter() !=null ? req.getTransporter().getFullName() : null, 
                        req.getCancelReason(),
                        req.getDeclineReason() != null ? req.getDeclineReason().toString() : null,
                        req.getDeclineMessage(),
                        req.getDeclinedAt(),
                        req.getDeclineDismissed(),
                        req.getCustomer().getId(),
                        req.getTransporter() != null ? req.getTransporter().getId():null, 
                        req.getWeightKg(),
                        req.getRequestedAt(),
                        req.getAcceptedAt())).toList();
    }
    
    public List<DeliveryResponseDTO> getAvailableRequestsForTransporters() {
        List<DeliveryRequest> pending = deliveryRequestRepository.findByStatus("PENDING");

        return pending.stream().map(req -> new DeliveryResponseDTO(
                req.getId(),
                req.getPickupCity(),
                req.getDropoffCity(),
                req.getItemType(),
                req.getDescription(),
                req.getPickupDate(),
                req.getStatus(),
                req.getCustomer().getEmail(),
                req.getTransporter() != null ? req.getTransporter().getEmail() : null,
                req.getCustomer().getFullName(),
                req.getTransporter() !=null ? req.getTransporter().getFullName() : null,
                req.getCancelReason(),
                req.getDeclineReason() != null ? req.getDeclineReason().toString() : null,
                req.getDeclineMessage(),
                req.getDeclinedAt(),
                req.getDeclineDismissed(),
                req.getCustomer().getId(),
                req.getTransporter() != null ? req.getTransporter().getId(): null,
                req.getWeightKg(),
                req.getRequestedAt(),
                req.getAcceptedAt())).toList();
    }
    
    public DeliveryResponseDTO acceptRequest(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User transporter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Transporter not found"));

        DeliveryRequest request = deliveryRequestRepository.findByIdAndStatus(id, "PENDING")
                .orElseThrow(() -> new RuntimeException("Delivery not found or already taken"));

        request.setStatus("ASSIGNED");
        request.setTransporter(transporter);

        DeliveryRequest saved = deliveryRequestRepository.save(request);

        return new DeliveryResponseDTO(
                saved.getId(),
                saved.getPickupCity(),
                saved.getDropoffCity(),
                saved.getItemType(),
                saved.getDescription(),
                saved.getPickupDate(),
                saved.getStatus(),
                saved.getCustomer().getEmail(),
                saved.getTransporter() != null ? saved.getTransporter().getEmail() : null,
                saved.getCustomer().getFullName(),
                saved.getTransporter() != null ? saved.getTransporter().getFullName() : null,
                saved.getCancelReason(),
                saved.getDeclineReason() != null ? saved.getDeclineReason().toString() : null,
                saved.getDeclineMessage(),
                saved.getDeclinedAt(),
                saved.getDeclineDismissed(),
                saved.getCustomer().getId(),
                saved.getTransporter() != null ? saved.getTransporter().getId() : null,
                saved.getWeightKg(),
                saved.getRequestedAt(),
                saved.getAcceptedAt()
        );
    }
    
    public List<DeliveryResponseDTO> getAssignedDeliveries() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User transporter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Transporter not found"));
        
        // Include all statuses that represent "assigned" deliveries
        List<String> statuses = Arrays.asList("REQUESTED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED");        
        List<DeliveryRequest> deliveries = deliveryRequestRepository.findByTransporterAndStatusIn(transporter, statuses);
    
        return deliveries.stream()
                .map(req -> new DeliveryResponseDTO(
                        req.getId(),
                        req.getPickupCity(),
                        req.getDropoffCity(),
                        req.getItemType(),
                        req.getDescription(),
                        req.getPickupDate(),
                        req.getStatus(),
                        req.getCustomer().getEmail(),
                        req.getTransporter() != null ? req.getTransporter().getEmail() : null,
                        req.getCustomer().getFullName(),
                        req.getTransporter() !=null ? req.getTransporter().getFullName() : null,
                        req.getCancelReason(),
                        req.getDeclineReason() != null ? req.getDeclineReason().toString() : null,
                        req.getDeclineMessage(),
                        req.getDeclinedAt(),
                        req.getDeclineDismissed(),
                        req.getCustomer().getId(),
                        req.getTransporter() != null ? req.getTransporter().getId() : null,
                        req.getWeightKg(),
                        req.getRequestedAt(),
                        req.getAcceptedAt())).toList();
    }
    
    public DeliveryResponseDTO updateDeliveryStatus(Long id, String newStatus) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User transporter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Transporter not found"));
    
        DeliveryRequest request = deliveryRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    
        if (!request.getTransporter().getId().equals(transporter.getId())) {
            throw new RuntimeException("Unauthorized");
        }
    
        // Optional: Add status validation
        if (newStatus.equals("PICKED_UP") && !request.getStatus().equals("ASSIGNED")) {
                throw new RuntimeException("Invalid status transition");
        }
        
        if (newStatus.equals("DELIVERED") && 
         !request.getStatus().equals("PICKED_UP") && 
         !request.getStatus().equals("IN_TRANSIT")) {
        throw new RuntimeException("Invalid status transition");
        }

        // ✅ Record timestamps
        if (newStatus.equals("ASSIGNED")) {
          request.setAssignedAt(LocalDateTime.now());
        } else if (newStatus.equals("DELIVERED")) {
          request.setDeliveredAt(LocalDateTime.now()); // You can rename this to deliveredAt if you want more clarity
        }
    
        request.setStatus(newStatus);
        DeliveryRequest updated = deliveryRequestRepository.save(request);
    
        return new DeliveryResponseDTO(
                updated.getId(),
                updated.getPickupCity(),
                updated.getDropoffCity(),
                updated.getItemType(),
                updated.getDescription(),
                updated.getPickupDate(),
                updated.getStatus(),
                updated.getCustomer().getEmail(),
                updated.getTransporter() != null ? updated.getTransporter().getEmail() : null,
                updated.getCustomer().getFullName(),
                updated.getTransporter() != null ? updated.getTransporter().getFullName() : null,
                updated.getCancelReason(),
                updated.getDeclineReason() != null ? updated.getDeclineReason().toString() : null,
                updated.getDeclineMessage(),
                updated.getDeclinedAt(),
                updated.getDeclineDismissed(),
                updated.getCustomer().getId(),
                updated.getTransporter() != null ? updated.getTransporter().getId() : null,
                updated.getWeightKg(),
                updated.getRequestedAt(),
                updated.getAcceptedAt()
        );
}
    
    public List<DeliveryResponseDTO> trackCustomerDeliveries() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    
        List<DeliveryRequest> requests = deliveryRequestRepository.findByCustomerAndStatusIn(customer, List.of("ASSIGNED", "PICKED_UP", "DELIVERED"));
    
        return requests.stream()
                .map(req -> new DeliveryResponseDTO(
                        req.getId(),
                        req.getPickupCity(),
                        req.getDropoffCity(),
                        req.getItemType(),
                        req.getDescription(),
                        req.getPickupDate(),
                        req.getStatus(),
                        req.getCustomer().getEmail(),
                        req.getTransporter() != null ? req.getTransporter().getEmail() : null,
                        req.getCustomer().getFullName(),
                        req.getTransporter() !=null ? req.getTransporter().getFullName() : null,
                        req.getCancelReason(),
                        req.getDeclineReason() != null ? req.getDeclineReason().toString() : null,
                        req.getDeclineMessage(),
                        req.getDeclinedAt(),
                        req.getDeclineDismissed(),
                        req.getCustomer().getId(),
                        req.getTransporter() != null ? req.getTransporter().getId() : null,
                        req.getWeightKg(),
                        req.getRequestedAt(),
                        req.getAcceptedAt())).toList();
    }

    public List<DeliveryResponseDTO> trackCustomerDeliveries(String status) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    
        List<DeliveryRequest> requests;
    
        if (status != null && !status.isEmpty()) {
            requests = deliveryRequestRepository.findByCustomerAndStatus(customer, status.toUpperCase());
        } else {
            requests = deliveryRequestRepository.findByCustomer(customer);
        }
    
        return requests.stream()
                .map(req -> new DeliveryResponseDTO(
                        req.getId(),
                        req.getPickupCity(),
                        req.getDropoffCity(),
                        req.getItemType(),
                        req.getDescription(),
                        req.getPickupDate(),
                        req.getStatus(),
                        req.getCustomer().getEmail(),
                        req.getTransporter() != null ? req.getTransporter().getEmail() : null,
                        req.getCustomer().getFullName(),
                        req.getTransporter() !=null ? req.getTransporter().getFullName() : null,
                        req.getCancelReason(),
                        req.getDeclineReason() != null ? req.getDeclineReason().toString() : null,
                        req.getDeclineMessage(),
                        req.getDeclinedAt(),
                        req.getDeclineDismissed(),
                        req.getCustomer().getId(),
                        req.getTransporter() != null ? req.getTransporter().getId() : null,
                        req.getWeightKg(),
                        req.getRequestedAt(),
                        req.getAcceptedAt())).toList();
    }

    public DeliveryResponseDTO cancelDelivery(Long id, String reason) {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User customer = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

            DeliveryRequest delivery = deliveryRequestRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Delivery not found"));
            
            // Verify this delivery belongs to the current customer
            if (!delivery.getCustomer().getId().equals(customer.getId())) {
                    throw new RuntimeException("Unauthorized");
            }

            //Only allow cancellation of ASSIGNED deliveries
            if (!"ASSIGNED".equals(delivery.getStatus())) {
                    throw new RuntimeException("Can only cancel assigned deliveries");
            }

            delivery.setStatus("CANCELLED");
            delivery.setCancelReason(reason);

            deliveryRequestRepository.save(delivery);

            return new DeliveryResponseDTO(
                        delivery.getId(),
                        delivery.getPickupCity(),
                        delivery.getDropoffCity(),
                        delivery.getItemType(),
                        delivery.getDescription(),
                        delivery.getPickupDate(),
                        delivery.getStatus(),
                        delivery.getCustomer().getEmail(),
                        delivery.getTransporter() != null ? delivery.getTransporter().getEmail() : null,
                        delivery.getCustomer().getFullName(),
                        delivery.getTransporter() != null ? delivery.getTransporter().getFullName() : null,
                        delivery.getCancelReason(),
                        delivery.getDeclineReason() != null ? delivery.getDeclineReason().toString() : null,
                        delivery.getDeclineMessage(),
                        delivery.getDeclinedAt(),
                        delivery.getDeclineDismissed(),
                        delivery.getCustomer().getId(),
                        delivery.getTransporter() != null ? delivery.getTransporter().getId() : null,
                        delivery.getWeightKg(),
                        delivery.getRequestedAt(),
                        delivery.getAcceptedAt()
                );
    }


    public DeliveryResponseDTO declineRequest(Long requestId, DeclineRequestDTO declineDTO) {
            DeliveryRequest request = deliveryRequestRepository.findById(requestId)
                            .orElseThrow(() -> new RuntimeException("Delivery request not found"));

            if (!"PENDING".equals(request.getStatus()) && !"ASSIGNED".equals(request.getStatus())) {
                    throw new RuntimeException("Can only decline pending or assigned delivery requests");
            }

            User currentUser = securityUtils.getCurrentUser();

            // Update request with decline information
            request.setStatus("DECLINED");
            request.setDeclineReason(declineDTO.getReason());
            request.setDeclineMessage(declineDTO.getCustomMessage());
            request.setDeclinedAt(LocalDateTime.now());
            request.setDeclinedBy(currentUser.getId());

            DeliveryRequest savedRequest = deliveryRequestRepository.save(request);

            // TODO: Send notification to customer about decline
            // Customer can then choose to repost or find another transporter

            return new DeliveryResponseDTO(
                            savedRequest.getId(),
                            savedRequest.getPickupCity(),
                            savedRequest.getDropoffCity(),
                            savedRequest.getItemType(),
                            savedRequest.getDescription(),
                            savedRequest.getPickupDate(),
                            savedRequest.getStatus(),
                            savedRequest.getCustomer().getEmail(),
                            savedRequest.getTransporter() != null ? savedRequest.getTransporter().getEmail() : null,
                            savedRequest.getCustomer().getFullName(),
                            savedRequest.getTransporter() != null ? savedRequest.getTransporter().getFullName() : null,
                            savedRequest.getCancelReason(),
                            savedRequest.getDeclineReason() != null ? savedRequest.getDeclineReason().toString() : null,
                            savedRequest.getDeclineMessage(),
                            savedRequest.getDeclinedAt(),
                            savedRequest.getDeclineDismissed(),
                            savedRequest.getCustomer().getId(),
                            savedRequest.getTransporter() != null ? savedRequest.getTransporter().getId() : null,
                            savedRequest.getWeightKg(),
                            savedRequest.getRequestedAt(),
                            savedRequest.getAcceptedAt()    
                );
    }
   
    public DeliveryResponseDTO dismissDecline(Long deliveryId) {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User customer = userRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("User not found"));

            DeliveryRequest request = deliveryRequestRepository.findById(deliveryId)
                            .orElseThrow(() -> new RuntimeException("Delivery not found"));

            // Verify this delivery belongs to the current customer
            if (!request.getCustomer().getId().equals(customer.getId())) {
                    throw new RuntimeException("Unauthorized");
            }

            request.setDeclineDismissed(true);
            DeliveryRequest saved = deliveryRequestRepository.save(request);

            return new DeliveryResponseDTO(
                            saved.getId(),
                            saved.getPickupCity(),
                            saved.getDropoffCity(),
                            saved.getItemType(),
                            saved.getDescription(),
                            saved.getPickupDate(),
                            saved.getStatus(),
                            saved.getCustomer().getEmail(),
                            saved.getTransporter() != null ? saved.getTransporter().getEmail() : null,
                            saved.getCustomer().getFullName(),
                            saved.getTransporter() != null ? saved.getTransporter().getFullName() : null,
                            saved.getCancelReason(),
                            saved.getDeclineReason() != null ? saved.getDeclineReason().toString() : null,
                            saved.getDeclineMessage(),
                            saved.getDeclinedAt(),
                            saved.getDeclineDismissed(),
                            saved.getCustomer().getId(),
                            saved.getTransporter() != null ? saved.getTransporter().getId() : null,
                            saved.getWeightKg(),
                            saved.getRequestedAt(),
                            saved.getAcceptedAt()                
                );
    }

    // Apply to a PENDING delivery
    // This allows transporters to apply to deliveries they see in the marketplace
    public DeliveryApplicationDTO applyToDelivery(Long deliveryId) {
            User transporter = securityUtils.getCurrentUser();

            DeliveryRequest deliveryRequest = deliveryRequestRepository.findById(deliveryId).orElseThrow(() -> new RuntimeException("Delivery not found"));

            // Validate delivery is PENDING
            if (!"PENDING".equals(deliveryRequest.getStatus())) {
                    throw new RuntimeException("Can only apply to pending deliveries");
            }

            // Check if transporter already applied
            if (deliveryApplicationRepository.existsByDeliveryRequestAndTransporter(deliveryRequest, transporter)) {
                    throw new RuntimeException("You have already applied to this delivery");
            }

            // Calculate quoted price using existing pricing system
            Double quotedPrice = calculateEstimatedEarnings(deliveryRequest.getWeightKg(), transporter);

            // Create application
            DeliveryApplication application = new DeliveryApplication();
            application.setDeliveryRequest(deliveryRequest);
            application.setTransporter(transporter);
            application.setQuotedPrice(quotedPrice);
            application.setStatus(ApplicationStatus.PENDING);

            DeliveryApplication savedApplication = deliveryApplicationRepository.save(application);

            return mapToApplicationDTO(savedApplication);

    }
    
    public List<DeliveryApplicationDTO> getDeliveryApplications(Long deliveryId) {
            User customer = securityUtils.getCurrentUser();

            DeliveryRequest deliveryRequest = deliveryRequestRepository.findById(deliveryId)
                            .orElseThrow(() -> new RuntimeException("Delivery not found"));

            // Verify this delivery belongs to the customer
            if (!deliveryRequest.getCustomer().getId().equals(customer.getId())) {
                    throw new RuntimeException("Unauthorized");
            }

            List<DeliveryApplication> applications = deliveryApplicationRepository
                            .findByDeliveryRequest(deliveryRequest);

            return applications.stream()
                            .map(this::mapToApplicationDTO)
                            .toList();
    }

    public DeliveryResponseDTO acceptApplication(Long applicationId) {
            User customer = securityUtils.getCurrentUser();

            DeliveryApplication application = deliveryApplicationRepository.findById(applicationId)
                            .orElseThrow(() -> new RuntimeException("Application not found"));

            DeliveryRequest deliveryRequest = application.getDeliveryRequest();

            // Verify this delivery belongs to the customer
            if (!deliveryRequest.getCustomer().getId().equals(customer.getId())) {
                    throw new RuntimeException("Unauthorized");
            }

            // Verify delivery is still PENDING
            if (!"PENDING".equals(deliveryRequest.getStatus())) {
                    throw new RuntimeException("Delivery is no longer pending");
            }

            // Accept this application
            application.setStatus(ApplicationStatus.ACCEPTED);
            deliveryApplicationRepository.save(application);

            // Reject all other applications for this delivery
            List<DeliveryApplication> otherApplications = deliveryApplicationRepository
                            .findByDeliveryRequest(deliveryRequest);
            for (DeliveryApplication otherApp : otherApplications) {
                    if (!otherApp.getId().equals(applicationId) && otherApp.getStatus() == ApplicationStatus.PENDING) {
                            otherApp.setStatus(ApplicationStatus.REJECTED);
                            deliveryApplicationRepository.save(otherApp);
                    }
            }

            // Update delivery status and assign transporter
            deliveryRequest.setStatus("ASSIGNED");
            deliveryRequest.setTransporter(application.getTransporter());
            deliveryRequest.setAssignedAt(LocalDateTime.now());

            DeliveryRequest savedDelivery = deliveryRequestRepository.save(deliveryRequest);

            return new DeliveryResponseDTO(
                            savedDelivery.getId(),
                            savedDelivery.getPickupCity(),
                            savedDelivery.getDropoffCity(),
                            savedDelivery.getItemType(),
                            savedDelivery.getDescription(),
                            savedDelivery.getPickupDate(),
                            savedDelivery.getStatus(),
                            savedDelivery.getCustomer().getEmail(),
                            savedDelivery.getTransporter() != null ? savedDelivery.getTransporter().getEmail() : null,
                            savedDelivery.getCustomer().getFullName(),
                            savedDelivery.getTransporter() != null ? savedDelivery.getTransporter().getFullName() : null,
                            savedDelivery.getCancelReason(),
                            savedDelivery.getDeclineReason() != null ? savedDelivery.getDeclineReason().toString()
                                            : null,
                            savedDelivery.getDeclineMessage(),
                            savedDelivery.getDeclinedAt(),
                            savedDelivery.getDeclineDismissed(),
                            savedDelivery.getCustomer().getId(),
                            savedDelivery.getTransporter() != null ?         savedDelivery.getTransporter().getId() : null,
                            savedDelivery.getWeightKg(),
                            savedDelivery.getRequestedAt(),
                            savedDelivery.getAcceptedAt()                
                );

    }
    

    // Helper method to map DeliveryApplication to DeliveryApplicationDTO
    private DeliveryApplicationDTO mapToApplicationDTO(DeliveryApplication application) {
            User transporter = application.getTransporter();

            // Get actual rating data
            Double averageRating = ratingRepository.findAverageRatingByRevieweeId(transporter.getId());
            Long totalRatings = ratingRepository.countByRevieweeId(transporter.getId());

            // Calculate completed deliveries count
            Long completedDeliveries = deliveryRequestRepository
                                                .countByTransporterAndStatus(transporter, "DELIVERED");
                
            return new DeliveryApplicationDTO(
                            application.getId(),
                            application.getDeliveryRequest().getId(),
                            transporter.getId(),
                            transporter.getFullName(),
                            transporter.getEmail(),
                            averageRating != null ? averageRating : 0.0,
                            completedDeliveries != null ? completedDeliveries.intValue() : 0,
                            totalRatings != null ? totalRatings.intValue() : 0,
                            application.getQuotedPrice(),
                            application.getAppliedAt(),
                            application.getStatus().toString());
    }


    private Double calculateEstimatedEarnings(Double weightKg, User transporter) {
            if (weightKg == null || weightKg <= 0 || transporter == null) {
                    return 0.0;
            }

            Optional<TransporterPricing> pricingOpt = transporterPricingRepository.findByTransporter(transporter);
            if (pricingOpt.isEmpty()) {
                    return 0.0; // No pricing configured
            }

            TransporterPricing pricing = pricingOpt.get();

            // Use the same logic as PaymentService
            double amount = (weightKg <= pricing.getWeightThreshold())
                            ? pricing.getFixedPriceUnderThreshold()
                            : weightKg * pricing.getRatePerKg();

            return amount;
    }
        

    public List<DeliveryApplicationDTO> getMyApplications() {
            User transporter = securityUtils.getCurrentUser();

            List<DeliveryApplication> applications = deliveryApplicationRepository.findByTransporter(transporter);

            return applications.stream()
                            .map(this::mapToApplicationDTO)
                            .toList();
    }

        @Transactional
        public DeliveryRequest acceptDeliveryRequest(Long deliveryId, Long transporterId) {
        DeliveryRequest delivery = deliveryRequestRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        
        // Validate delivery is in REQUESTED status
        if (!"REQUESTED".equals(delivery.getStatus())) {
                throw new RuntimeException("Delivery is not in requested status");
        }
        
        // Validate the transporter is the assigned one
        if (delivery.getTransporter() == null || !delivery.getTransporter().getId().equals(transporterId)) {
                throw new RuntimeException("You are not assigned to this delivery");
        }
        
        // Check if request hasn't expired (48 hours)
        if (delivery.getRequestedAt() != null && 
                delivery.getRequestedAt().isBefore(LocalDateTime.now().minusHours(48))) {
                throw new RuntimeException("Delivery request has expired");
        }
        
        // Accept the delivery
        delivery.setStatus("ASSIGNED");
        delivery.setAcceptedAt(LocalDateTime.now());
        
        return deliveryRequestRepository.save(delivery);
        }
   
    
}
