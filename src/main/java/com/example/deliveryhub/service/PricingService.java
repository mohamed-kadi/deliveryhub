package com.example.deliveryhub.service;

import java.util.Optional;
import org.springframework.stereotype.Service;

import com.example.deliveryhub.model.TransporterPricing;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.TransporterPricingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PricingService {

    private final TransporterPricingRepository transporterPricingRepository;

    public Optional<TransporterPricing> getPricingByTransporter(User transporter) {
        return transporterPricingRepository.findByTransporter(transporter);
    }

    public TransporterPricing createPricing(User transporter, TransporterPricing pricingRequest) {
        // Check if pricing already exists
        Optional<TransporterPricing> existingPricing = transporterPricingRepository.findByTransporter(transporter);
        if (existingPricing.isPresent()) {
            throw new IllegalStateException("Pricing configuration already exists. Use update instead.");
        }

        TransporterPricing pricing = new TransporterPricing();
        pricing.setTransporter(transporter);
        pricing.setRatePerKg(pricingRequest.getRatePerKg());
        pricing.setFixedPriceUnderThreshold(pricingRequest.getFixedPriceUnderThreshold());
        pricing.setWeightThreshold(pricingRequest.getWeightThreshold());
        pricing.setCurrency(pricingRequest.getCurrency());

        return transporterPricingRepository.save(pricing);
    }

    public TransporterPricing updatePricing(User transporter, TransporterPricing pricingRequest) {
        TransporterPricing existingPricing = transporterPricingRepository.findByTransporter(transporter)
            .orElseThrow(() -> new IllegalArgumentException("No pricing configuration found. Create one first."));

        existingPricing.setRatePerKg(pricingRequest.getRatePerKg());
        existingPricing.setFixedPriceUnderThreshold(pricingRequest.getFixedPriceUnderThreshold());
        existingPricing.setWeightThreshold(pricingRequest.getWeightThreshold());
        existingPricing.setCurrency(pricingRequest.getCurrency());

        return transporterPricingRepository.save(existingPricing);
    }
}
