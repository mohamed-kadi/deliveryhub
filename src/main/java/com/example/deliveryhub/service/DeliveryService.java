package com.example.deliveryhub.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.deliveryhub.dto.DeliveryRequestDTO;
import com.example.deliveryhub.dto.DeliveryResponseDTO;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.DeliveryRequestRepository;
import com.example.deliveryhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRequestRepository deliveryRequestRepository;
    private final UserRepository userRepository;

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
        
        request.setStatus("PENDING");

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
                saved.getCancelReason());
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
                        req.getCancelReason()))
                .toList();
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
                req.getCancelReason())).toList();
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
                saved.getCancelReason()
                );
    }
    
    public List<DeliveryResponseDTO> getAssignedDeliveries() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User transporter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Transporter not found"));
    
        List<DeliveryRequest> deliveries = deliveryRequestRepository.findByTransporterAndStatus(transporter, "ASSIGNED");
    
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
                        req.getCancelReason()
                        
                ))
                .toList();
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
        if (newStatus.equals("DELIVERED") && !request.getStatus().equals("PICKED_UP")) {
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
                updated.getCancelReason()
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
                        req.getCancelReason()))
                .toList();
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
                        req.getCancelReason()))
                .toList();
    }

    public DeliveryResponseDTO cancelDelivery(Long id, String reason) {
        DeliveryRequest delivery = deliveryRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Delivery not found"));
    
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
            delivery.getCancelReason()
        );
    }
    
    
    
}
