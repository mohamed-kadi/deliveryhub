package com.example.deliveryhub.service;

import java.util.Optional;
import org.springframework.stereotype.Service;

import com.example.deliveryhub.dto.PaymentSummaryDTO;
import com.example.deliveryhub.enums.PaymentMethod;
import com.example.deliveryhub.enums.PaymentStatus;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.TransporterPricing;
import com.example.deliveryhub.repository.DeliveryRequestRepository;
import com.example.deliveryhub.repository.TransporterPricingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final DeliveryRequestRepository deliveryRequestRepository;
    private final TransporterPricingRepository transporterPricingRepository;

    public DeliveryRequest initiatePayment(Long deliveryId, PaymentMethod method) {
        DeliveryRequest delivery = deliveryRequestRepository.findById(deliveryId).orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        delivery.setPaymentMethod(method);

        // Calculate paymentAmount based on transporter pricing
        if (delivery.getTransporter() !=null && delivery.getWeightKg() !=null) {
            TransporterPricing pricing = transporterPricingRepository.findByTransporter(delivery.getTransporter()).orElseThrow(() -> new IllegalArgumentException("Pricing not found for transporter"));

            double weight = delivery.getWeightKg();
            double amount = (weight <= pricing.getWeightThreshold()) 
                ? pricing.getFixedPriceUnderThreshold() 
                : weight * pricing.getRatePerKg();

            delivery.setPaymentAmount(amount);
        }

        // logic varies based on method
        switch (method) {
            case COD -> delivery.setPaymentStatus(PaymentStatus.AWAITING_CASH_PAYMENT);
            case PAYPAL, STRIPE -> delivery.setPaymentStatus(PaymentStatus.PENDING);
        }
        return deliveryRequestRepository.save(delivery);
    }

    public DeliveryRequest markCashAsPaid(Long deliveryId) {
        DeliveryRequest delivery = deliveryRequestRepository.findById(deliveryId).orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        if (delivery.getPaymentMethod() != PaymentMethod.COD) {
            throw new IllegalStateException("This delivery is not set for Cash on Delivery");
        }

        delivery.setPaymentStatus(PaymentStatus.PAID);
        return deliveryRequestRepository.save(delivery);   
    }

    public DeliveryRequest confirmOnlinePayment(Long deliveryId) {
        DeliveryRequest delivery = deliveryRequestRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));
    
        if (delivery.getPaymentMethod() == PaymentMethod.COD) {
            throw new IllegalStateException("COD payments must be confirmed with cash");
        }
    
        if (delivery.getPaymentStatus() == PaymentStatus.PAID) {
            throw new IllegalStateException("Payment already confirmed");
        }
    
        delivery.setPaymentStatus(PaymentStatus.PAID);
        return deliveryRequestRepository.save(delivery);
    }
    

    public PaymentStatus getPaymentStatus(Long deliveryId) {
        Optional<DeliveryRequest> deliveryOpt = deliveryRequestRepository.findById(deliveryId);
        return deliveryOpt.map(DeliveryRequest::getPaymentStatus).orElseThrow(() -> new IllegalArgumentException("Delivery not found"));
    }

    public PaymentSummaryDTO getPaymentSummary(Long deliveryId) {
        DeliveryRequest delivery = deliveryRequestRepository.findById(deliveryId)
            .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        if (delivery.getTransporter() == null || delivery.getWeightKg() == null) {
            throw new IllegalStateException("Transporter and weight must be set before calculating summary");
        }

        TransporterPricing pricing = transporterPricingRepository.findByTransporter(delivery.getTransporter())
            .orElseThrow(() -> new IllegalArgumentException("Pricing not found for transporter"));

        double weight = delivery.getWeightKg();
        double amount = (weight <= pricing.getWeightThreshold())
                ? pricing.getFixedPriceUnderThreshold()
                : weight * pricing.getRatePerKg();

        return PaymentSummaryDTO.builder()
            .deliveryId(delivery.getId())
            .transporterName(delivery.getTransporter().getFullName())
            .weightKg(weight)
            .ratePerKg(pricing.getRatePerKg())
            .fixedPriceUnderThreshold(pricing.getFixedPriceUnderThreshold())
            .threshold(pricing.getWeightThreshold())
            .calculatedAmount(amount)
            .paymentMethod(delivery.getPaymentMethod())
            .paymentStatus(delivery.getPaymentStatus())
            .build();
    }


}
