package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleUserDTO {
    private String googleId;
    private String email;
    private String name;
    private String givenName;
    private String familyName;
    private String pictureUrl;
    private boolean emailVerified;
}
