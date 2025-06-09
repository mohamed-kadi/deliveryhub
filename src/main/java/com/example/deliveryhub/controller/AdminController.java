package com.example.deliveryhub.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.example.deliveryhub.dto.AdminDashboardDTO;
import com.example.deliveryhub.dto.AdminDeliveryViewDTO;
import com.example.deliveryhub.dto.CancelDeliveryRequest;
import com.example.deliveryhub.dto.CancelledDeliveryDTO;
import com.example.deliveryhub.dto.DailyDeliveryStatsDTO;
import com.example.deliveryhub.dto.DeliveryResponseDTO;
import com.example.deliveryhub.dto.PendingDeliveryAgeDTO;
import com.example.deliveryhub.dto.TimeRangeDeliveryCountDTO;
import com.example.deliveryhub.dto.TopCityDTO;
import com.example.deliveryhub.dto.TopRouteDTO;
import com.example.deliveryhub.dto.TopTransporterDTO;
import com.example.deliveryhub.dto.TransporterAdminDTO;
import com.example.deliveryhub.dto.TransporterCompletionStatsDTO;
import com.example.deliveryhub.dto.TransporterPerformanceDTO;
import com.example.deliveryhub.enums.TimeRange;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/deliveries")
    public ResponseEntity<List<AdminDeliveryViewDTO>> viewAllDeliveries() {
        return ResponseEntity.ok(adminService.getAllDeliveries());
   }

   @GetMapping("/dashboard")
   public ResponseEntity<AdminDashboardDTO> getDashboardMetrics() {
       return ResponseEntity.ok(adminService.getDashboardMetrics());
   }

   @GetMapping("/dashboard/daily-stats")
    public ResponseEntity<List<DailyDeliveryStatsDTO>> getDailyStats(
        @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().minusDays(7)}") LocalDate startDate) {

    List<DailyDeliveryStatsDTO> stats = adminService.getDailyDeliveryStats(startDate);
       return ResponseEntity.ok(stats);
   }

   @GetMapping("/dashboard/status-percentages")
   public ResponseEntity<Map<String, Double>> getStatusPercentages() {
      return ResponseEntity.ok(adminService.getDeliveryStatusPercentages());
   }
   
   @GetMapping("/dashboard/transporter-reliability")
   public ResponseEntity<List<TransporterPerformanceDTO>>   getTransporterReliabilityScores() {
     return ResponseEntity.ok(adminService.getTransporterReliabilityScores());
   }


   @GetMapping("/dashboard/top-pickup-cities")
   public ResponseEntity<List<TopCityDTO>> getTopPickupCities() {
       return ResponseEntity.ok(adminService.getTopPickupCities());
   }

   @GetMapping("/dashboard/top-dropoff-cities")
   public ResponseEntity<List<TopCityDTO>> getTopDropoffCities() {
      return ResponseEntity.ok(adminService.getTopDropoffCities());
   }


   @GetMapping("/dashboard/total-deliveries")
   public ResponseEntity<List<TimeRangeDeliveryCountDTO>> getTotalDeliveries (@RequestParam(defaultValue = "MONTHLY") TimeRange range) {
       return ResponseEntity.ok(adminService.getTotalDeliveriesByRange(range));
   }

   @GetMapping("/dashboard/top-transporters")
   public ResponseEntity<List<TopTransporterDTO>> topTransporters() {
       return ResponseEntity.ok(adminService.getTopTransporters());
   }

   @GetMapping("/dashboard/completion-time")
   public ResponseEntity<Double> getAverageCompletionTime() {
      return ResponseEntity.ok(adminService.getAverageDeliveryCompletionDays());
   }

   @GetMapping("/dashboard/transporter-completion-stats")
   public ResponseEntity<List<TransporterCompletionStatsDTO>> getCompletionTimePerTransporter() {
     return ResponseEntity.ok(adminService.getCompletionTimePerTransporter());
  }


   @GetMapping("/dashboard/top-routes")
   public ResponseEntity<List<TopRouteDTO>> getTopRoutes() {
      return ResponseEntity.ok(adminService.getTopRoutes());
   }

   @GetMapping("/dashboard/old-pending")
   public ResponseEntity<List<PendingDeliveryAgeDTO>> getOldPendingDeliveries(
         @RequestParam(name = "threshold", defaultValue = "5") int threshold) {
     return ResponseEntity.ok(adminService.getOldPendingDeliveries(threshold));
   }

   @PostMapping("/dashboard/cancel")
   public ResponseEntity<DeliveryResponseDTO> cancelDelivery(@RequestBody CancelDeliveryRequest request) {
     return ResponseEntity.ok(adminService.cancelDelivery(request));
  }

   @PreAuthorize("hasRole('ADMIN')")
   @GetMapping("/dashboard/cancelled-deliveries")
   public ResponseEntity<List<CancelledDeliveryDTO>> getCancelledDeliveries() {
     return ResponseEntity.ok(adminService.getCancelledDeliveries());
   }

   @GetMapping("/dashboard/cancelled-reasons")
   public ResponseEntity<Map<String, Long>> getCancelledReasonStats() {
     return ResponseEntity.ok(adminService.getCancelledReasonStats());
   }










    





}