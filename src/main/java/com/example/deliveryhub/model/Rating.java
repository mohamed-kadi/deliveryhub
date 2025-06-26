package com.example.deliveryhub.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // reference to delivery ( for context)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_id", nullable = false)
    private DeliveryRequest delivery;
    
    // who gave the rating
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false) 
    private User reviewer;
    
    // who recieved the rating
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role revieweeRole; // CUSTOMER or TRANSPORTER

    @Column(nullable = false)
    private int rating; // 1 to 5 scale

    private String feedback;

    @Column(nullable = false)
    private LocalDateTime timestamp;


}
