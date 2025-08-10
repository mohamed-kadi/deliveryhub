package com.example.deliveryhub.dto;

import com.example.deliveryhub.model.Role;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private Long id;
    private String fullName;
    private String email;
    private Role role;

    // Keep your existing constructor for backward compatibility
    public AuthResponse(String accessToken, Long id, String fullName, String email, Role role) {
        this.accessToken = accessToken;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role; 
    }
   

}
