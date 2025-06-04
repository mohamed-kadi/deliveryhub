package com.example.deliveryhub.dto;

import com.example.deliveryhub.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegisterDTO {

    @NotBlank
    private String fullName;

    @Email
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String password;

    private Role role; // CUSTOMER or TRANSPORTER
}

