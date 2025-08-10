package com.example.deliveryhub.controller;

import com.example.deliveryhub.auth.JwtUtils;
import com.example.deliveryhub.dto.*;
import com.example.deliveryhub.model.RefreshToken;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.UserRepository;
import com.example.deliveryhub.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.deliveryhub.service.GoogleOAuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final GoogleOAuthService googleOAuthService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDTO dto) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(auth);

            User user = userRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Generate access token
            String accessToken = jwtUtils.generateToken(dto.getEmail());

            // Generate refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(dto.getEmail());

            JwtResponse response = JwtResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken.getToken())
                    .tokenType("Bearer")
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .expiresIn(3600L) // 1 hour in seconds
                    .build();

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Authentication failed: " + e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            String newAccessToken = refreshTokenService.generateNewAccessToken(request.getRefreshToken());

            // Get user info for response
            String email = jwtUtils.getUsernameFromToken(newAccessToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            JwtResponse response = JwtResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(request.getRefreshToken()) // Keep the same refresh token
                    .tokenType("Bearer")
                    .email(user.getEmail())
                    .role(user.getRole().toString())
                    .expiresIn(3600L) // 1 hour in seconds
                    .build();

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Invalid refresh token: " + e.getMessage());
        }
    }

    // @PostMapping("/refresh")
    // public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
    //     try {
    //         // Find and verify the existing refresh token
    //         RefreshToken currentRefreshToken = refreshTokenService.findByToken(request.getRefreshToken())
    //                 .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
    //         refreshTokenService.verifyExpiration(currentRefreshToken);

    //         User user = currentRefreshToken.getUser();

    //         // Generate a NEW access token
    //         String newAccessToken = jwtUtils.generateToken(user.getEmail());

    //         // Generate a NEW refresh token (this will delete the old one in the service)
    //         RefreshToken newRefreshTokenObject = refreshTokenService.createRefreshToken(user.getEmail());
    //         String newRefreshToken = newRefreshTokenObject.getToken();

    //         JwtResponse response = JwtResponse.builder()
    //                 .accessToken(newAccessToken)
    //                 .refreshToken(newRefreshToken) // <-- RETURN THE NEW REFRESH TOKEN HERE
    //                 .tokenType("Bearer")
    //                 .email(user.getEmail())
    //                 .role(user.getRole().name())
    //                 .expiresIn(3600L)
    //                 .build();

    //         return ResponseEntity.ok(response);

    //     } catch (RuntimeException e) {
    //         return ResponseEntity.badRequest().body("Invalid refresh token: " + e.getMessage());
    //     }
    // }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtUtils.getUsernameFromToken(token);
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                // Delete refresh token for this user
                refreshTokenService.deleteByUser(user);

                return ResponseEntity.ok("Logged out successfully");
            }
            return ResponseEntity.badRequest().body("No valid token provided");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Logout failed: " + e.getMessage());
        }
    }

    /**
     * Google OAuth Login - For existing users
     * POST /api/auth/google-login
     */
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        try {
            // Verify Google token and get user info
            GoogleUserDTO googleUser = googleOAuthService.verifyGoogleToken(request.getCredential());

            // Find existing user by email
            Optional<User> existingUser = userRepository.findByEmail(googleUser.getEmail());

            if (existingUser.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("No account found with this Google email. Please register first.");
            }

            User user = existingUser.get();

            // Generate JWT tokens
            String accessToken = jwtUtils.generateToken(user.getEmail());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

            // Return response in same format as regular login
            JwtResponse response = JwtResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken.getToken())
                    .tokenType("Bearer")
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .expiresIn(3600L)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Google authentication failed: " + e.getMessage());
        }
    }

    /**
     * Google OAuth Registration - For new users
     * POST /api/auth/google-register
     */
    @PostMapping("/google-register")
    public ResponseEntity<?> googleRegister(@Valid @RequestBody GoogleRegisterRequest request) {
        try {
            // Verify Google token and get user info
            GoogleUserDTO googleUser = googleOAuthService.verifyGoogleToken(request.getCredential());

            // Validate Google user data
            googleOAuthService.validateGoogleUserForRegistration(googleUser);

            // Check if user already exists
            if (userRepository.findByEmail(googleUser.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body("Account already exists with this email. Please sign in instead.");
            }

            // Determine user role
            Role userRole = Role.CUSTOMER; // Default
            if (request.getRole() != null) {
                try {
                    userRole = Role.valueOf(request.getRole().toUpperCase());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest()
                            .body("Invalid role specified. Must be CUSTOMER or TRANSPORTER.");
                }
            }

            // Generate full name
            String fullName = request.getFullName();
            if (fullName == null || fullName.trim().isEmpty()) {
                fullName = googleOAuthService.generateFullName(googleUser);
            }

            // Create new user
            User newUser = User.builder()
                    .fullName(fullName)
                    .email(googleUser.getEmail())
                    .phone("") // Google doesn't provide phone, user can update later
                    .password("") // No password needed for Google OAuth users
                    .role(userRole)
                    .verified(true) // Google accounts are pre-verified
                    .availableForDeliveries(userRole == Role.TRANSPORTER) // Default availability
                    .build();

            // Save user
            User savedUser = userRepository.save(newUser);

            // Generate JWT tokens
            String accessToken = jwtUtils.generateToken(savedUser.getEmail());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getEmail());

            // Return response
            JwtResponse response = JwtResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken.getToken())
                    .tokenType("Bearer")
                    .email(savedUser.getEmail())
                    .role(savedUser.getRole().name())
                    .expiresIn(3600L)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Google registration failed: " + e.getMessage());
        }
    }

    /**
     * Unified Google OAuth - Handle both login and registration
     * POST /api/auth/google-auth
     */
    @PostMapping("/google-auth")
    public ResponseEntity<?> googleAuth(@Valid @RequestBody GoogleRegisterRequest request) {
        System.out.println("🔍 Google auth request received");
        System.out.println("🔍 Role from frontend: " + request.getRole());
        try {
            // Verify Google token and get user info
            GoogleUserDTO googleUser = googleOAuthService.verifyGoogleToken(request.getCredential());

            // Check if user exists
            Optional<User> existingUser = userRepository.findByEmail(googleUser.getEmail());

            User user;

            if (existingUser.isPresent()) {
                // User exists - sign them in
                user = existingUser.get();
                System.out.println("🔍 EXISTING user found with role: " + user.getRole());

                // Optional: Log if user tried to register with different role
                if (request.getRole() != null && !request.getRole().equalsIgnoreCase(user.getRole().name())) {
                    System.out.println("⚠️ User tried to register as " + request.getRole() + " but already exists as "
                            + user.getRole().name());
                }

            } else {
                // User doesn't exist - create new account
                googleOAuthService.validateGoogleUserForRegistration(googleUser);

                // Determine user role
                Role userRole = Role.CUSTOMER; // Default
                if (request.getRole() != null) {
                    try {
                        userRole = Role.valueOf(request.getRole().toUpperCase());
                        System.out.println("🔍 Successfully parsed role: " + userRole);
                    } catch (IllegalArgumentException e) {
                        System.out.println("❌ Failed to parse role: " + request.getRole());

                        userRole = Role.CUSTOMER;
                    }
                }
                System.out.println("🔍 Creating user with role: " + userRole);
                // Generate full name
                String fullName = request.getFullName();
                if (fullName == null || fullName.trim().isEmpty()) {
                    fullName = googleOAuthService.generateFullName(googleUser);
                }

                // Create new user
                user = User.builder()
                        .fullName(fullName)
                        .email(googleUser.getEmail())
                        .phone("") // Google doesn't provide phone
                        .password("") // No password for OAuth users
                        .role(userRole)
                        .verified(true) // Google accounts are pre-verified
                        .availableForDeliveries(userRole == Role.TRANSPORTER)
                        .build();

                user = userRepository.save(user);
                System.out.println("🔍 User created successfully with role: " + user.getRole());
            }

            // Generate JWT tokens
            String accessToken = jwtUtils.generateToken(user.getEmail());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

            // Return response
            JwtResponse response = JwtResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken.getToken())
                    .tokenType("Bearer")
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .expiresIn(3600L)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Google auth error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Google authentication failed: " + e.getMessage());
        }
    }
}