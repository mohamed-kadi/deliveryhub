package com.example.deliveryhub.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.TransporterRoute;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.TransporterRouteRepository;
import com.example.deliveryhub.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final TransporterRouteRepository routeRepository;
    private final UserRepository userRepository;

    public List<TransporterRoute> getMyRoutes() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User transporter = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (transporter.getRole() != Role.TRANSPORTER) {
            throw new RuntimeException("Only transporters can access their routes");
        }
        return routeRepository.findByTransporterAndActiveTrue(transporter);
    }

    public TransporterRoute createRoute(TransporterRoute routeRequest) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
       
        User transporter = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (transporter.getRole() != Role.TRANSPORTER) {
            throw new RuntimeException("Only transporters can create routes");
        }

        TransporterRoute route = TransporterRoute.builder()
                .transporter(transporter)
                .pickupCity(routeRequest.getPickupCity())
                .dropoffCity(routeRequest.getDropoffCity())
                .travelDate(routeRequest.getTravelDate())
                .pickupStartDate(routeRequest.getPickupStartDate())
                .pickupEndDate(routeRequest.getPickupEndDate())
                .notes(routeRequest.getNotes())
                .active(true)
                .build();

        return routeRepository.save(route); 
    }

    public TransporterRoute updateRoute(Long routeId, TransporterRoute routeRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User transporter = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    
        TransporterRoute route = routeRepository.findById(routeId)
            .orElseThrow(() -> new RuntimeException("Route not found"));
    
        if (!route.getTransporter().equals(transporter)) {
            throw new RuntimeException("You can only edit your own routes");
        }
    
        // Update fields
        route.setPickupCity(routeRequest.getPickupCity());
        route.setDropoffCity(routeRequest.getDropoffCity());
        route.setTravelDate(routeRequest.getTravelDate());
        route.setPickupStartDate(routeRequest.getPickupStartDate());
        route.setPickupEndDate(routeRequest.getPickupEndDate());
        route.setNotes(routeRequest.getNotes());
    
        return routeRepository.save(route);
    }

    public TransporterRoute deleteRoute(Long routeId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User transporter = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        TransporterRoute route = routeRepository.findById(routeId).orElseThrow(() -> new RuntimeException("Route not found"));

        if (!route.getTransporter().equals(transporter)) {
            throw new RuntimeException("You can only delete your own routes");
        }

        // Soft delete by setting active to false
        route.setActive(false);
        return routeRepository.save(route);

    }

}
