package com.example.deliveryhub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.deliveryhub.dto.TransporterProfileDTO;
import com.example.deliveryhub.service.TransporterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transporters")
@RequiredArgsConstructor
public class TransporterController {

    private final TransporterService transporterService;

    @GetMapping("/featured")
    public ResponseEntity<List<TransporterProfileDTO>> getFeaturedTransporters() {
        List<TransporterProfileDTO> featuredTransporters = transporterService.getFeaturedTransporters();
        return ResponseEntity.ok(featuredTransporters);
    }

    @GetMapping("/all")
    public ResponseEntity<List<TransporterProfileDTO>> getAllTransporters() {
        List<TransporterProfileDTO> allTransporters = transporterService.getAllAvailableTransporters();
        return ResponseEntity.ok(allTransporters);
    }
}