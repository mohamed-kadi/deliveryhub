package com.example.deliveryhub.service;

import com.example.deliveryhub.dto.UserRegisterDTO;
import com.example.deliveryhub.dto.UserResponseDTO;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
}

