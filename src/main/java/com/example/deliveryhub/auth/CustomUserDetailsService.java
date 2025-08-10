// package com.example.deliveryhub.auth;

// import com.example.deliveryhub.model.User;
// import com.example.deliveryhub.repository.UserRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.security.core.userdetails.*;
// import org.springframework.stereotype.Service;

// @Service
// @RequiredArgsConstructor
// public class CustomUserDetailsService implements UserDetailsService {

//     private final UserRepository userRepository;

//     @Override
//     public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//         User user = userRepository.findByEmail(email)
//             .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//         return org.springframework.security.core.userdetails.User
//                 .withUsername(user.getEmail())
//                 .password(user.getPassword())
//                 .roles(user.getRole().name())
//                 .build();
//     }
// }

package com.example.deliveryhub.auth;

import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // CRITICAL FIX: Check for a valid password.
        // This prevents authentication attempts for users who should only use OAuth.
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new BadCredentialsException("User account is not configured for password-based login.");
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}
