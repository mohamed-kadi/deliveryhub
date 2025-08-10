package com.example.deliveryhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.deliveryhub.enums.DeclineReason;
import com.example.deliveryhub.enums.PaymentMethod;
import com.example.deliveryhub.enums.PaymentStatus;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pickupCity;
    private String dropoffCity;
    private String itemType;
    private String description;

    private LocalDate pickupDate;

    @ManyToOne
    private User customer;

    @ManyToOne
    private User transporter;

    private String status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
      this.createdAt = LocalDateTime.now();
    }
    
    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "cancel_reason")
    private String cancelReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    private Double paymentAmount;

    @Column(name = "weight_kg")
    private Double weightKg;

    // Additional fields for decline reasons
    @Enumerated(EnumType.STRING)
    @Column(name = "decline_reason")
    private DeclineReason declineReason;

    @Column(name = "decline_message")
    private String declineMessage;

    @Column(name = "declined_at")
    private LocalDateTime declinedAt;

    @Column(name = "declined_by")
    private Long declinedBy; // Transporter ID who declined

    @Column(name = "decline_dismissed")
    private Boolean declineDismissed = false;

}
