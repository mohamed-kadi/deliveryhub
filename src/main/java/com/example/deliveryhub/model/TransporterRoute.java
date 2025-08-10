package com.example.deliveryhub.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transporter_routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransporterRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporter_id", nullable = false)
    private User transporter;
    
    @Column(nullable = false)
    private String pickupCity;
    
    @Column(nullable = false)
    private String dropoffCity;
    
    @Column(nullable = false)
    private LocalDate travelDate;
    
    @Column(nullable = false)
    private LocalDate pickupStartDate;
    
    @Column(nullable = false)
    private LocalDate pickupEndDate;
    
    @Column(nullable = false)
    private boolean active = true;
    
    @Column(columnDefinition = "TEXT")
    @Size(max = 2000, message = "Notes cannot exceed 2000 characters")
    private String notes;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;

        @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
