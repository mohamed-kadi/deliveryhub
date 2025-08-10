package com.example.deliveryhub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.example.deliveryhub.model.TransporterRoute;
import com.example.deliveryhub.service.RouteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping("/my-routes")
    public ResponseEntity<List<TransporterRoute>> getMyRoutes(Authentication auth) {
        List<TransporterRoute> routes = routeService.getMyRoutes();
        return ResponseEntity.ok(routes);
    }

    @PostMapping
    public ResponseEntity<TransporterRoute> createRoute(@RequestBody TransporterRoute routeRequest) {
        TransporterRoute createRoute = routeService.createRoute(routeRequest);
        return ResponseEntity.ok(createRoute);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransporterRoute> updateRoute(@PathVariable Long id, @RequestBody TransporterRoute routeRequest) {
        TransporterRoute updatedRoute = routeService.updateRoute(id, routeRequest);
        return ResponseEntity.ok(updatedRoute);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok("Route deleted successfully");
    }


}
