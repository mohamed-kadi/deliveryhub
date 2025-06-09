package com.example.deliveryhub.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.deliveryhub.dto.AdminDashboardDTO;
import com.example.deliveryhub.dto.AdminDeliveryViewDTO;
import com.example.deliveryhub.dto.CancelDeliveryRequest;
import com.example.deliveryhub.dto.CancelledDeliveryDTO;
import com.example.deliveryhub.dto.DailyDeliveryStatsDTO;
import com.example.deliveryhub.dto.DeliveryResponseDTO;
import com.example.deliveryhub.dto.DeliveryStatusPercentageDTO;
import com.example.deliveryhub.dto.PendingDeliveryAgeDTO;
import com.example.deliveryhub.dto.TimeRangeDeliveryCountDTO;
import com.example.deliveryhub.dto.TopCityDTO;
import com.example.deliveryhub.dto.TopRouteDTO;
import com.example.deliveryhub.dto.TopTransporterDTO;
import com.example.deliveryhub.dto.TransporterAdminDTO;
import com.example.deliveryhub.dto.TransporterCompletionStatsDTO;
import com.example.deliveryhub.dto.TransporterPerformanceDTO;
import com.example.deliveryhub.enums.TimeRange;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.repository.DeliveryRequestRepository;
import com.example.deliveryhub.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final DeliveryRequestRepository deliveryRequestRepository;

    public List<TransporterAdminDTO> getPendingTransporters() {
        return userRepository.findByRoleAndVerifiedFalse(Role.TRANSPORTER)
                .stream()
                .map(user -> {
                    TransporterAdminDTO dto = new TransporterAdminDTO();
                    dto.setId(user.getId());
                    dto.setFullName(user.getFullName());
                    dto.setEmail(user.getEmail());
                    dto.setPhone(user.getPhone());
                    dto.setRole(user.getRole());
                    dto.setVerified(user.isVerified());
                    return dto;

                }).collect(Collectors.toList());

    }

    public TransporterAdminDTO verifyTransporter(Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transporter not found"));

        if (user.getRole() != Role.TRANSPORTER || user.isVerified()) {
            throw new RuntimeException("Invalid transporter or already verified");
        }

        user.setVerified(true);
        userRepository.save(user);

        TransporterAdminDTO dto = new TransporterAdminDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setVerified(user.isVerified());

        return dto;
    }

    public List<AdminDeliveryViewDTO> getAllDeliveries() {
        return deliveryRequestRepository.findAll().stream().map(req -> {
            AdminDeliveryViewDTO dto = new AdminDeliveryViewDTO();
            dto.setId(req.getId());
            dto.setPickupCity(req.getPickupCity());
            dto.setDropoffCity(req.getDropoffCity());
            dto.setItemType(req.getItemType());
            dto.setStatus(req.getStatus());
            dto.setCustomerName(req.getCustomer() != null ? req.getCustomer().getFullName() : "N/A");
            dto.setTransporterName(req.getTransporter() != null ? req.getTransporter().getFullName() : "Unassigned");
                return dto;
        }).toList();
    }

    public AdminDashboardDTO getDashboardMetrics() {
    long totalDeliveries = deliveryRequestRepository.count();
    long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
    long totalTransporters = userRepository.countByRole(Role.TRANSPORTER);
    long pendingDeliveries = deliveryRequestRepository.countByStatus("PENDING");
    long assignedDeliveries = deliveryRequestRepository.countByStatus("ASSIGNED");
    long pickedUpDeliveries = deliveryRequestRepository.countByStatus("PICKED_UP");
    long deliveredDeliveries = deliveryRequestRepository.countByStatus("DELIVERED");

        return new AdminDashboardDTO(
            totalDeliveries,
            totalCustomers,
            totalTransporters,
            pendingDeliveries,
            assignedDeliveries,
            pickedUpDeliveries,
            deliveredDeliveries
        );
    }

    public List<DailyDeliveryStatsDTO> getDailyDeliveryStats(LocalDate startDate) {
        return deliveryRequestRepository.countDeliveriesByStatusPerDay(startDate);
    }

    public Map<String, Double> getDeliveryStatusPercentages() {
    List<DeliveryStatusPercentageDTO> counts = deliveryRequestRepository.countDeliveriesByStatus();
    long total = counts.stream().mapToLong(DeliveryStatusPercentageDTO::getCount).sum();

    Map<String, Double> percentages = new HashMap<>();
    for (DeliveryStatusPercentageDTO entry : counts) {
        double percent = (entry.getCount() * 100.0) / total;
        percentages.put(entry.getStatus(), Math.round(percent * 100.0) / 100.0); // rounded to 2 decimals
       }

       return percentages;
    }

    public List<TransporterPerformanceDTO> getTransporterReliabilityScores() {
        List<Object[]> results = deliveryRequestRepository.getTransporterDeliveryStats();
    
        return results.stream()
                .map(row -> {
                    String email = (String) row[0];
                    Long completed = ((Number) row[1]).longValue();
                    Long cancelled = ((Number) row[2]).longValue();
                    Long total = completed + cancelled;
    
                    double reliabilityScore = total == 0 ? 0.0 : ((double) completed / total) * 100;
    
                    return new TransporterPerformanceDTO(
                            email,
                            total,
                            completed,
                            cancelled,
                            Math.round(reliabilityScore * 100.0) / 100.0
                    );
                })
                .toList();
    }
    

    public List<TopCityDTO> getTopPickupCities() {
       return deliveryRequestRepository.findTopPickupCities();
    }

    public List<TopCityDTO> getTopDropoffCities() {
       return deliveryRequestRepository.findTopDropoffCities();
    }

    public List<TimeRangeDeliveryCountDTO> getTotalDeliveriesByRange(TimeRange range) {
    List<Object[]> results = deliveryRequestRepository.countDeliveriesGroupedBy(range.name());
    
    return results.stream().map(row -> 
        new TimeRangeDeliveryCountDTO(
            (String) row[0], 
            ((Number) row[1]).longValue())
        ).collect(Collectors.toList());
    }
    
    public List<TopTransporterDTO> getTopTransporters() {
        return deliveryRequestRepository.findTopTransportersByCompletedDeliveries();
    }

    public double getAverageDeliveryCompletionDays() {
        Double avg = deliveryRequestRepository.getAverageCompletionDays();
           return avg != null ? Math.round(avg * 100.0) / 100.0 : 0.0;
    }

    public List<TopRouteDTO> getTopRoutes() {
        return deliveryRequestRepository.findTopRoutes();
    }

    public List<PendingDeliveryAgeDTO> getOldPendingDeliveries(int thresholdDays) {
       return deliveryRequestRepository.findOldPendingDeliveries(thresholdDays);
    }

    public DeliveryResponseDTO cancelDelivery(CancelDeliveryRequest request) {
    DeliveryRequest delivery = deliveryRequestRepository.findById(request.getDeliveryId())
        .orElseThrow(() -> new RuntimeException("Delivery not found"));

    delivery.setStatus("CANCELLED");
    delivery.setCancelReason(request.getCancelReason());

    DeliveryRequest updated = deliveryRequestRepository.save(delivery);

        return new DeliveryResponseDTO(
            updated.getId(),
            updated.getPickupCity(),
            updated.getDropoffCity(),
            updated.getItemType(),
            updated.getDescription(),
            updated.getPickupDate(),
            updated.getStatus(),
            updated.getCustomer().getEmail(),
            updated.getTransporter() != null ? updated.getTransporter().getEmail() : null, 
            updated.getCancelReason()
        );
    }


    public List<CancelledDeliveryDTO> getCancelledDeliveries() {
        return deliveryRequestRepository.findCancelledDeliveries();
    }

    public Map<String, Long> getCancelledReasonStats() {
    List<Object[]> groupedData = deliveryRequestRepository.countCancelledGroupedByReason();
    Map<String, Long> result = new LinkedHashMap<>();

    for (Object[] row : groupedData) {
        String reason = (String) row[0];
        Long count = ((Number) row[1]).longValue();
        result.put(reason, count);
    }

     return result;
    }

    public List<TransporterCompletionStatsDTO> getCompletionTimePerTransporter() {
        List<Object[]> results = deliveryRequestRepository.getCompletionTimePerTransporterRaw();

        return results.stream()
            .map(row -> new TransporterCompletionStatsDTO(
                (String) row[0],                    // transporterEmail
                ((Number) row[1]).longValue(),      // totalCompleted
                row[2] != null ? ((Number) row[2]).doubleValue() : 0.0  // averageCompletionTime
            ))
            .collect(Collectors.toList());
    }




    

    


}
