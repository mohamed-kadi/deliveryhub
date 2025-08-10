package com.example.deliveryhub.service;

import com.example.deliveryhub.dto.UserRegisterDTO;
import com.example.deliveryhub.dto.UserResponseDTO;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserResponseDTO registerUser(UserRegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());
        //user.setVerified(false); // Manually verified later for transporters
        
        // ✅ Auto-verify admins and customers
        if (dto.getRole() == Role.TRANSPORTER) {
            user.setVerified(false); // Needs admin approval
        } else {
            user.setVerified(true); // Auto-verified for CUSTOMER or ADMIN
        }
        
        User saved = userRepository.save(user);

        return new UserResponseDTO(
                saved.getId(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getRole(),
                saved.isVerified()
        );
    }

        public void updateAvailability(boolean available) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setAvailableForDeliveries(available);
        userRepository.save(user);
    }

    public Boolean getAvailability() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getAvailableForDeliveries() != null ? user.getAvailableForDeliveries() : true;
    }
    // Add this method to your UserService.java
    public UserResponseDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Use constructor instead of builder
        UserResponseDTO response = new UserResponseDTO();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole()); 
        response.setVerified(user.isVerified()); // Try isVerified() instead of getVerified()

        return response;
    }
    
    public UserResponseDTO getUserById(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
        
    UserResponseDTO response = new UserResponseDTO();
    response.setId(user.getId());
    response.setFullName(user.getFullName());
    response.setPhone(user.getPhone());
    response.setEmail(user.getEmail());
    // Skip role and verified for simplicity, or add them if your DTO supports it
    
    return response;
}
}

