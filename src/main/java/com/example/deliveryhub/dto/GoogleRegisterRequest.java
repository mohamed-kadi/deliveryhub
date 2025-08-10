package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleRegisterRequest {
    private String credential; // The Google ID token from frontend
    private String role;       // CUSTOMER or TRANSPORTER
    private String fullName;   // Optional - will use Google name if not provided
    private String email;      // Optional - will use Google email if not provided
}
