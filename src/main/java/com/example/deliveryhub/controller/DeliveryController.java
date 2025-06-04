package com.example.deliveryhub.controller;

import com.example.deliveryhub.dto.DeliveryRequestDTO;
import com.example.deliveryhub.dto.DeliveryResponseDTO;
import com.example.deliveryhub.dto.DeliveryStatusUpdateDTO;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.service.DeliveryService;
import com.example.deliveryhub.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;
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
}
