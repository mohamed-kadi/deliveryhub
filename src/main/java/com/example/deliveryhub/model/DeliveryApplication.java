package com.example.deliveryhub.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.example.deliveryhub.enums.ApplicationStatus;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryApplication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "delivery_request_id")
    private DeliveryRequest deliveryRequest;
    
    @ManyToOne
    @JoinColumn(name = "transporter_id")
    private User transporter;
    
    @Column(name = "applied_at")
    private LocalDateTime appliedAt;
    
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status; // PENDING, ACCEPTED, REJECTED
    
    private Double quotedPrice; // Transporter's price quote
    
    @PrePersist
    public void prePersist() {
        this.appliedAt = LocalDateTime.now();
        this.status = ApplicationStatus.PENDING;
    }
}
