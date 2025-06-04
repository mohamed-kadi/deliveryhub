package com.example.deliveryhub.util;

import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private final UserRepository userRepository;

    public SecurityUtils(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void assertRole(User user, Role expectedRole) {
        if (user.getRole() != expectedRole) {
            throw new AccessDeniedException("Access denied: incorrect role");
        }
    }

    public void assertVerified(User user) {
        if (!user.isVerified()) {
            throw new RuntimeException("Access denied: user not verified");
        }
    }
}
