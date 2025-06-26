package com.example.deliveryhub.model;

import java.time.LocalDateTime;

import com.example.deliveryhub.enums.MessageType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private DeliveryRequest delivery;

    @ManyToOne
    private User sender;

    @ManyToOne
    private User receiver;

    private String content;

    private LocalDateTime timestamp;

    @Column(name = "is_read")   
    private Boolean isRead = false;
    @Column(name = "is_delivered")
    private Boolean isDelivered = false;

    private String fileUrl;
    private String fileName;

    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    private MessageType messageType;

    

}
