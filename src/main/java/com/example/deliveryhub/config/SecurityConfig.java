package com.example.deliveryhub.config;

import com.example.deliveryhub.auth.CustomUserDetailsService;
import com.example.deliveryhub.auth.JwtAuthFilter;
import java.util.List;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import lombok.RequiredArgsConstructor;
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api/users/register", "/uploads/chat/**","/ws/**","/app/**","/topic/**","/websocket-test.html").permitAll()
                        .requestMatchers("/api/payment/**").authenticated()
                        .requestMatchers("/api/routes/**").hasRole("TRANSPORTER")
                        .requestMatchers("/api/deliveries/**").hasAnyRole("CUSTOMER", "TRANSPORTER") //added 
                        .requestMatchers("/api/marketplace/**").authenticated() // added
                        .requestMatchers("/api/chat/**").authenticated() //added
                        .anyRequest()
                        .authenticated()
                        
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .userDetailsService(userDetailsService)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        
        // Add Google's domains for OAuth
        configuration.addAllowedOrigin("https://accounts.google.com");
        configuration.addAllowedOrigin("https://oauth2.googleapis.com");
        configuration.addAllowedOrigin("http://localhost:3000");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}

