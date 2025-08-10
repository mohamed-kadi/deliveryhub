package com.example.deliveryhub.controller;

import com.example.deliveryhub.dto.UserRegisterDTO;
import com.example.deliveryhub.dto.UserResponseDTO;
import com.example.deliveryhub.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRegisterDTO dto) {
        UserResponseDTO response = userService.registerUser(dto);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/protected")
    public ResponseEntity<String> protectedEndpoint() {
        return ResponseEntity.ok("You are authenticated!");
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Principal principal) {
        UserResponseDTO currentUser = userService.getCurrentUser(principal.getName());
        return ResponseEntity.ok(currentUser);
    }

    @PutMapping("/availability")
    public ResponseEntity<String> updateAvailability(@RequestParam boolean available) {
        userService.updateAvailability(available);
        return ResponseEntity.ok("Availability updated successfully");
    }

    @GetMapping("/availability") 
    public ResponseEntity<Boolean> getAvailability() {
        Boolean availability = userService.getAvailability();
        return ResponseEntity.ok(availability);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long userId) {
        UserResponseDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

}

