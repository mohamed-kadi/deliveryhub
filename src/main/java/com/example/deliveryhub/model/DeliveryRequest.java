package com.example.deliveryhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

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
}
