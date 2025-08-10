package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryApplicationDTO {
    private Long id;
    private Long deliveryRequestId;
    private Long transporterId;
    private String transporterName;
    private String transporterEmail;
    private Double transporterRating;
    private Integer completedDeliveries;
    private Integer totalRatings;
    private Double quotedPrice;
    private LocalDateTime appliedAt;
    private String status;
}
