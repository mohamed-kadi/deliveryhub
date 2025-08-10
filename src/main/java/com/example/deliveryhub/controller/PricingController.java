package com.example.deliveryhub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.deliveryhub.model.TransporterPricing;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.service.PricingService;
import com.example.deliveryhub.util.SecurityUtils;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

@RestController
@RequestMapping("/api/pricing")
@RequiredArgsConstructor
public class PricingController {

    private final PricingService pricingService;
    private final SecurityUtils securityUtils;

    // @GetMapping("/my-config")
    // public ResponseEntity<TransporterPricing> getMyPricingConfig() {
    //     User currentUser = securityUtils.getCurrentUser();
        
    //     Optional<TransporterPricing> pricing = transporterPricingRepository.findByTransporter(currentUser);
        
    //     if (pricing.isPresent()) {
    //         return ResponseEntity.ok(pricing.get());
    //     } else {
    //         return ResponseEntity.notFound().build();
    //     }
    // }

    // @PostMapping("/config")
    // public ResponseEntity<TransporterPricing> createPricingConfig(@RequestBody TransporterPricing pricingRequest) {
    //     User currentUser = securityUtils.getCurrentUser();
        
    //     // Check if pricing already exists
    //     Optional<TransporterPricing> existingPricing = transporterPricingRepository.findByTransporter(currentUser);
    //     if (existingPricing.isPresent()) {
    //         return ResponseEntity.badRequest().build(); // Use PUT for updates
    //     }
        
    //     // Create new pricing
    //     TransporterPricing pricing = new TransporterPricing();
    //     pricing.setTransporter(currentUser);
    //     pricing.setRatePerKg(pricingRequest.getRatePerKg());
    //     pricing.setFixedPriceUnderThreshold(pricingRequest.getFixedPriceUnderThreshold());
    //     pricing.setWeightThreshold(pricingRequest.getWeightThreshold());
    //     pricing.setCurrency(pricingRequest.getCurrency());
        
    //     TransporterPricing savedPricing = transporterPricingRepository.save(pricing);
    //     return ResponseEntity.ok(savedPricing);
    // }

    // @PutMapping("/config")
    // public ResponseEntity<TransporterPricing> updatePricingConfig(@RequestBody TransporterPricing pricingRequest) {
    //     User currentUser = securityUtils.getCurrentUser();
        
    //     Optional<TransporterPricing> existingPricingOpt = transporterPricingRepository.findByTransporter(currentUser);
    //     if (!existingPricingOpt.isPresent()) {
    //         return ResponseEntity.notFound().build(); // Use POST for creation
    //     }
        
    //     // Update existing pricing
    //     TransporterPricing existingPricing = existingPricingOpt.get();
    //     existingPricing.setRatePerKg(pricingRequest.getRatePerKg());
    //     existingPricing.setFixedPriceUnderThreshold(pricingRequest.getFixedPriceUnderThreshold());
    //     existingPricing.setWeightThreshold(pricingRequest.getWeightThreshold());
    //     existingPricing.setCurrency(pricingRequest.getCurrency());
        
    //     TransporterPricing savedPricing = transporterPricingRepository.save(existingPricing);
    //     return ResponseEntity.ok(savedPricing);
    // }

    @GetMapping("/my-config")
    public ResponseEntity<TransporterPricing> getMyPricingConfig() {
        User currentUser = securityUtils.getCurrentUser();
        Optional<TransporterPricing> pricing = pricingService.getPricingByTransporter(currentUser);
        
        return pricing.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/config")
    public ResponseEntity<TransporterPricing> createPricingConfig(@RequestBody TransporterPricing pricingRequest) {
        User currentUser = securityUtils.getCurrentUser();
        TransporterPricing savedPricing = pricingService.createPricing(currentUser, pricingRequest);
        return ResponseEntity.ok(savedPricing);
    }

    @PutMapping("/config")
    public ResponseEntity<TransporterPricing> updatePricingConfig(@RequestBody TransporterPricing pricingRequest) {
        User currentUser = securityUtils.getCurrentUser();
        TransporterPricing savedPricing = pricingService.updatePricing(currentUser, pricingRequest);
        return ResponseEntity.ok(savedPricing);
    }
}
