package com.example.deliveryhub.dto;

import com.example.deliveryhub.enums.PaymentMethod;
import com.example.deliveryhub.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSummaryDTO {

    private Long deliveryId;
    private String transporterName;
    private double weightKg;
    private double ratePerKg;
    private double fixedPriceUnderThreshold;
    private double threshold;
    private double calculatedAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;

}
