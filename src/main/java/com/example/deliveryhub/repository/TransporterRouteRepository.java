package com.example.deliveryhub.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.deliveryhub.model.TransporterRoute;
import com.example.deliveryhub.model.User;

public interface TransporterRouteRepository extends JpaRepository<TransporterRoute, Long> {

    List<TransporterRoute> findByTransporterAndActiveTrue(User transporter);

    @Query("SELECT tr FROM TransporterRoute tr WHERE tr.active = true AND " +
           "tr.pickupCity ILIKE %:pickupCity% AND tr.dropoffCity ILIKE %:dropoffCity% AND " +
           ":pickupDate BETWEEN tr.pickupStartDate AND tr.pickupEndDate")
    List<TransporterRoute> findAvailableRoutes(@Param("pickupCity") String pickupCity, 
                                              @Param("dropoffCity") String dropoffCity, 
                                              @Param("pickupDate") LocalDate pickupDate);
}
