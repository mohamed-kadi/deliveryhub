package com.example.deliveryhub.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.example.deliveryhub.dto.GoogleUserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleOAuthService {

    @Value("${google.client.id}")
    private String googleClientId;

    private final GoogleIdTokenVerifier verifier;

    public GoogleOAuthService(@Value("${google.client.id}") String googleClientId) {
        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
    }

    /**
     * Verify Google ID token and extract user information
     */
    public GoogleUserDTO verifyGoogleToken(String idTokenString) throws Exception {
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                // Extract user information from the token
                String userId = payload.getSubject();
                String email = payload.getEmail();
                boolean emailVerified = payload.getEmailVerified();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                String givenName = (String) payload.get("given_name");
                String familyName = (String) payload.get("family_name");

                // Validate essential information
                if (email == null || !emailVerified) {
                    throw new RuntimeException("Email not verified or not provided by Google");
                }

                return GoogleUserDTO.builder()
                        .googleId(userId)
                        .email(email)
                        .name(name)
                        .givenName(givenName)
                        .familyName(familyName)
                        .pictureUrl(pictureUrl)
                        .emailVerified(emailVerified)
                        .build();
                        
            } else {
                throw new RuntimeException("Invalid Google ID token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Google token: " + e.getMessage(), e);
        }
    }

    /**
     * Generate full name from Google user data
     */
    public String generateFullName(GoogleUserDTO googleUser) {
        if (googleUser.getName() != null && !googleUser.getName().trim().isEmpty()) {
            return googleUser.getName().trim();
        }
        
        // Fallback to combining given and family names
        StringBuilder fullName = new StringBuilder();
        if (googleUser.getGivenName() != null) {
            fullName.append(googleUser.getGivenName().trim());
        }
        if (googleUser.getFamilyName() != null) {
            if (fullName.length() > 0) {
                fullName.append(" ");
            }
            fullName.append(googleUser.getFamilyName().trim());
        }
        
        return fullName.length() > 0 ? fullName.toString() : googleUser.getEmail();
    }

    /**
     * Validate Google user data for registration
     */
    public void validateGoogleUserForRegistration(GoogleUserDTO googleUser) {
        if (googleUser.getEmail() == null || googleUser.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required from Google account");
        }
        
        if (!googleUser.isEmailVerified()) {
            throw new RuntimeException("Google email must be verified");
        }
    }
}
