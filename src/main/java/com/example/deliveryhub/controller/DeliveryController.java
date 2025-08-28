package com.example.deliveryhub.controller;

import com.example.deliveryhub.dto.CancelDeliveryRequest;
import com.example.deliveryhub.dto.DeclineRequestDTO;
import com.example.deliveryhub.dto.DeliveryApplicationDTO;
import com.example.deliveryhub.dto.DeliveryRequestDTO;
import com.example.deliveryhub.dto.DeliveryResponseDTO;
import com.example.deliveryhub.dto.DeliveryStatusUpdateDTO;
import com.example.deliveryhub.dto.RatingDTO;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.Rating;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.service.DeliveryService;
import com.example.deliveryhub.service.RatingService;
import com.example.deliveryhub.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final RatingService ratingService; 
    private final SecurityUtils securityUtils;

    @PostMapping
    public ResponseEntity<DeliveryResponseDTO> createDelivery(@Valid @RequestBody DeliveryRequestDTO dto) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.CUSTOMER);
        return ResponseEntity.ok(deliveryService.createRequest(dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<DeliveryResponseDTO>> getMyRequests() {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.CUSTOMER);
        return ResponseEntity.ok(deliveryService.getMyRequests());
    }

    @GetMapping("/available")
    public ResponseEntity<List<DeliveryResponseDTO>> getAvailable() {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.getAvailableRequestsForTransporters());
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<DeliveryResponseDTO> acceptRequest(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.acceptRequest(id));
    }

    @PostMapping("/{deliveryId}/accept-request")
    public ResponseEntity<String> acceptDeliveryRequest(@PathVariable Long deliveryId) {
        User transporter = securityUtils.getCurrentUser();
        securityUtils.assertRole(transporter, Role.TRANSPORTER);
        securityUtils.assertVerified(transporter);
        
        try {
            DeliveryRequest delivery = deliveryService.acceptDeliveryRequest(deliveryId, transporter.getId());
            return ResponseEntity.ok("Delivery " + delivery.getId() + " accepted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<DeliveryResponseDTO>> getAssignedDeliveries() {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.getAssignedDeliveries());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody DeliveryStatusUpdateDTO statusDTO
    ) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(id, statusDTO.getStatus()));
    }

    @GetMapping("/track")
    public ResponseEntity<List<DeliveryResponseDTO>> trackDeliveries(
            @RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(deliveryService.trackCustomerDeliveries(status));
    }

    @PostMapping("/{id}/decline")
    public ResponseEntity<DeliveryResponseDTO> declineRequest(
            @PathVariable Long id,
            @RequestBody DeclineRequestDTO declineDTO) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.declineRequest(id, declineDTO));
    }

    @PutMapping("/{id}/dismiss-decline")
    public ResponseEntity<DeliveryResponseDTO> dismissDecline(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.CUSTOMER);
        return ResponseEntity.ok(deliveryService.dismissDecline(id));
    }
    
    @PostMapping("/{id}/cancel")
    public ResponseEntity<DeliveryResponseDTO> cancelDelivery(
            @PathVariable Long id,
            @RequestBody CancelDeliveryRequest cancelRequest) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.CUSTOMER);
        return ResponseEntity.ok(deliveryService.cancelDelivery(id, cancelRequest.getCancelReason()));
    }

    // Apply to a PENDING delivery
    @PostMapping("/{id}/apply")
    public ResponseEntity<DeliveryApplicationDTO> applyToDelivery(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.applyToDelivery(id));
    }

    // Get applications for a delivery (customer view)
    @GetMapping("/{id}/applications")
    public ResponseEntity<List<DeliveryApplicationDTO>> getDeliveryApplications(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.CUSTOMER);
        return ResponseEntity.ok(deliveryService.getDeliveryApplications(id));
    }

    // Accept an application (customer chooses transporter)
    @PostMapping("/applications/{applicationId}/accept")
    public ResponseEntity<DeliveryResponseDTO> acceptApplication(@PathVariable Long applicationId) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.CUSTOMER);
        return ResponseEntity.ok(deliveryService.acceptApplication(applicationId));
    }

    // Get my applications (transporter view)
    @GetMapping("/applications/my")
    public ResponseEntity<List<DeliveryApplicationDTO>> getMyApplications() {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.getMyApplications());
    }

     
    @PostMapping("/{deliveryId}/rate")
    public ResponseEntity<Rating> rateDelivery(
            @PathVariable Long deliveryId,
            @RequestBody RatingDTO ratingDTO) {
        User user = securityUtils.getCurrentUser();
        // Allow both CUSTOMER and TRANSPORTER to rate
        return ResponseEntity.ok(ratingService.submitRating(ratingDTO, user.getEmail()));
    }

    @GetMapping("/{deliveryId}/can-rate")
    public ResponseEntity<Boolean> canRateDelivery(@PathVariable Long deliveryId) {
        User user = securityUtils.getCurrentUser();
        boolean canRate = ratingService.canUserRateDelivery(deliveryId, user.getId());
        return ResponseEntity.ok(canRate);
    }

    @GetMapping("/{deliveryId}/my-rating")
    public ResponseEntity<Rating> getMyRating(@PathVariable Long deliveryId) {
        User user = securityUtils.getCurrentUser();
        Optional<Rating> rating = ratingService.getMyRatingForDelivery(deliveryId, user.getId());
        return rating.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }  
}
