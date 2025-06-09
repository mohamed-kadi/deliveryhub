package com.example.deliveryhub.repository;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.deliveryhub.dto.CancelledDeliveryDTO;
import com.example.deliveryhub.dto.DailyDeliveryStatsDTO;
import com.example.deliveryhub.dto.DeliveryStatusPercentageDTO;
import com.example.deliveryhub.dto.PendingDeliveryAgeDTO;
import com.example.deliveryhub.dto.TimeRangeDeliveryCountDTO;
import com.example.deliveryhub.dto.TopCityDTO;
import com.example.deliveryhub.dto.TopRouteDTO;
import com.example.deliveryhub.dto.TopTransporterDTO;
import com.example.deliveryhub.dto.TransporterPerformanceDTO;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.User;

public interface DeliveryRequestRepository extends  JpaRepository<DeliveryRequest, Long> {

    List<DeliveryRequest> findByCustomer(User user);

    List<DeliveryRequest> findByStatus(String status);
    
    Optional<DeliveryRequest> findByIdAndStatus(Long id, String status);
    
    List<DeliveryRequest> findByTransporterAndStatus(User transporter, String status);

    List<DeliveryRequest> findByCustomerAndStatusIn(User customer, List<String> of);

    List<DeliveryRequest> findByCustomerAndStatus(User customer, String status);

    long countByStatus(String status);

    @Query("""
        SELECT new com.example.deliveryhub.dto.DailyDeliveryStatsDTO(
            dr.pickupDate, dr.status, COUNT(dr)
        )
        FROM DeliveryRequest dr
        WHERE dr.pickupDate >= :startDate
        GROUP BY dr.pickupDate, dr.status
        ORDER BY dr.pickupDate DESC
    """)
    List<DailyDeliveryStatsDTO> countDeliveriesByStatusPerDay(@Param("startDate") LocalDate startDate);
    
    @Query("""
    SELECT new com.example.deliveryhub.dto.DeliveryStatusPercentageDTO(
        dr.status, COUNT(dr)
    )
    FROM DeliveryRequest dr
    GROUP BY dr.status
   """)
   List<DeliveryStatusPercentageDTO> countDeliveriesByStatus();

    @Query("""
    SELECT new com.example.deliveryhub.dto.TransporterPerformanceDTO(
        dr.transporter.email, COUNT(dr)
    )
    FROM DeliveryRequest dr
    WHERE dr.transporter IS NOT NULL
    GROUP BY dr.transporter.email
    ORDER BY COUNT(dr) DESC
   """)
   List<TransporterPerformanceDTO> countDeliveriesPerTransporter();

   @Query("""
    SELECT new com.example.deliveryhub.dto.TopCityDTO(dr.pickupCity, COUNT(dr))
    FROM DeliveryRequest dr
    GROUP BY dr.pickupCity
    ORDER BY COUNT(dr) DESC
    """)
    List<TopCityDTO> findTopPickupCities();

    @Query("""
    SELECT new com.example.deliveryhub.dto.TopCityDTO(dr.dropoffCity, COUNT(dr))
    FROM DeliveryRequest dr
    GROUP BY dr.dropoffCity
    ORDER BY COUNT(dr) DESC
    """)
    List<TopCityDTO> findTopDropoffCities();

    @Query(value = """
    SELECT 
        CASE 
            WHEN :range = 'WEEKLY' THEN TO_CHAR(dr.pickup_date, 'IYYY-IW')
            WHEN :range = 'MONTHLY' THEN TO_CHAR(dr.pickup_date, 'YYYY-MM')
            WHEN :range = 'YEARLY' THEN TO_CHAR(dr.pickup_date, 'YYYY')
        END as period,
        COUNT(*) 
    FROM delivery_request dr
    GROUP BY period
    ORDER BY period DESC
    """, nativeQuery = true)
    List<Object[]> countDeliveriesGroupedBy(@Param("range") String range);

    @Query("""
    SELECT new com.example.deliveryhub.dto.TopTransporterDTO(
        dr.transporter.email, COUNT(dr)
    )
    FROM DeliveryRequest dr
    WHERE dr.status = 'DELIVERED'
    GROUP BY dr.transporter.email
    ORDER BY COUNT(dr) DESC
    """)
    List<TopTransporterDTO> findTopTransportersByCompletedDeliveries();

    @Query(
    value = "SELECT AVG(DATE_PART('day', delivered_at - assigned_at)) FROM delivery_request WHERE status = 'DELIVERED' AND assigned_at IS NOT NULL AND delivered_at IS NOT NULL",
    nativeQuery = true
    )
    Double getAverageCompletionDays();

    @Query("""
    SELECT new com.example.deliveryhub.dto.TopRouteDTO(
        CONCAT(dr.pickupCity, ' ➡️ ', dr.dropoffCity),
        COUNT(dr)
    )
    FROM DeliveryRequest dr
    GROUP BY dr.pickupCity, dr.dropoffCity
    ORDER BY COUNT(dr) DESC
    """)
    List<TopRouteDTO> findTopRoutes();

    @Query("""
    SELECT new com.example.deliveryhub.dto.PendingDeliveryAgeDTO(
        dr.id,
        dr.pickupCity,
        dr.dropoffCity,
        dr.customer.email,
        CAST(DATE_PART('day', AGE(CURRENT_DATE, dr.pickupDate)) AS int)
    )
    FROM DeliveryRequest dr
    WHERE dr.status = 'PENDING' 
    AND DATE_PART('day', AGE(CURRENT_DATE, dr.pickupDate)) > :threshold
    """)
    List<PendingDeliveryAgeDTO> findOldPendingDeliveries(@Param("threshold") int thresholdDays);

    @Query("""
    SELECT new com.example.deliveryhub.dto.CancelledDeliveryDTO(
        dr.id,
        dr.pickupCity,
        dr.dropoffCity,
        dr.customer.email,
        dr.pickupDate,
        dr.cancelReason
    )
    FROM DeliveryRequest dr
    WHERE dr.status = 'CANCELLED'
    ORDER BY dr.pickupDate DESC
    """)
    List<CancelledDeliveryDTO> findCancelledDeliveries();

    @Query("""
    SELECT dr.cancelReason, COUNT(dr)
    FROM DeliveryRequest dr
    WHERE dr.status = 'CANCELLED' AND dr.cancelReason IS NOT NULL
    GROUP BY dr.cancelReason
    ORDER BY COUNT(dr) DESC
    """)
    List<Object[]> countCancelledGroupedByReason();










    
    




}
