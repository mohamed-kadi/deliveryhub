package com.example.deliveryhub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.deliveryhub.dto.PaymentSummaryDTO;
import com.example.deliveryhub.enums.PaymentMethod;
import com.example.deliveryhub.enums.PaymentStatus;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // initiate a payment (user after booking)
    @PostMapping("/{deliveryId}/initiate")
    public ResponseEntity<DeliveryRequest> initiatePayment(@PathVariable Long deliveryId, @RequestParam PaymentMethod method) {
        DeliveryRequest updated = paymentService.initiatePayment(deliveryId, method);
        return ResponseEntity.ok(updated);
    }
    // mark cash paymetn as completed (used by admin or transporter)
    @PostMapping("/{deliveryId}/mark-cash-paid")
    public ResponseEntity<DeliveryRequest> markCashPayment(@PathVariable Long deliveryId) {
        DeliveryRequest updated = paymentService.markCashAsPaid(deliveryId);
        return ResponseEntity.ok(updated);
    }

    // Check current payment status
    @GetMapping("/{deliveryId}/status")
    public ResponseEntity<PaymentStatus> getStatus(@PathVariable Long deliveryId) {
        
        return ResponseEntity.ok(paymentService.getPaymentStatus(deliveryId));
    }

    @GetMapping("/{deliveryId}/summary")
    public ResponseEntity<PaymentSummaryDTO> getSummary(@PathVariable Long deliveryId, Authentication authentication) {
        PaymentSummaryDTO summary = paymentService.getPaymentSummary(deliveryId);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/{deliveryId}/confirm")
    public ResponseEntity<DeliveryRequest> confirmOnlinePayment(@PathVariable Long deliveryId) {
        DeliveryRequest updated = paymentService.confirmOnlinePayment(deliveryId);
        return ResponseEntity.ok(updated);
    }




}
