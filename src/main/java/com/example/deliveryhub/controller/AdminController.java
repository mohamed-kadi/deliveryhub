package com.example.deliveryhub.controller;

import java.util.List;
import com.example.deliveryhub.dto.TransporterAdminDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.deliveryhub.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor                    
public class AdminController {

    private final AdminService adminService;
    
    @GetMapping("/transporters/pending")
    public ResponseEntity<List<TransporterAdminDTO>> getPendingTransporters() {
        List<TransporterAdminDTO> pendingTransporters = adminService.getPendingTransporters();
        return ResponseEntity.ok(pendingTransporters);
    }

    @PutMapping("/transporters/{id}/verify")
    public ResponseEntity<?> verifyTransporter(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.verifyTransporter(id));
    }

    

}
