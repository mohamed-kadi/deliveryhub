package com.example.deliveryhub.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.deliveryhub.dto.TransporterMarketplaceDTO;
import com.example.deliveryhub.service.TransporterMarketplaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class TransporterMarketplaceController {

    private final TransporterMarketplaceService marketplaceService;

    @GetMapping("/transporters")
    public ResponseEntity<List<TransporterMarketplaceDTO>> getAvailableTransporters() {
        List<TransporterMarketplaceDTO> transporters = marketplaceService.getAvailableTransporters();
        return ResponseEntity.ok(transporters);
    }

    @GetMapping("/transporters/{id}")
    public ResponseEntity<TransporterMarketplaceDTO> getTransporterDetails(@PathVariable Long id) {
        Optional<TransporterMarketplaceDTO> transporter = marketplaceService.getTransporterDetails(id);
        return transporter.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/transporters/{id}/estimate")
    public ResponseEntity<Double> getEstimatedCost(
            @PathVariable Long id, 
            @RequestParam Double weight) {
        Double estimatedCost = marketplaceService.calculateEstimatedCost(id, weight);
        return ResponseEntity.ok(estimatedCost);
    }
}