package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor 
@NoArgsConstructor 
public class TransporterPerformanceDTO {
    private String transporterEmail;
    private Long totalDeliveries;
    private Long completedDeliveries;
    private Long cancelledDeliveries;
    private Double reliabilityScore;

    public TransporterPerformanceDTO(String transporterEmail, Long totalDeliveries, Long completedDeliveries, Long cancelledDeliveries) {
        this.transporterEmail = transporterEmail;
        this.totalDeliveries = totalDeliveries;
        this.completedDeliveries = completedDeliveries;
        this.cancelledDeliveries = cancelledDeliveries;
    }
    

}
