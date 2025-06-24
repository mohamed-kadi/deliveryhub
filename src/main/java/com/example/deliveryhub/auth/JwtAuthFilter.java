package com.example.deliveryhub.auth;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter implements Filter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String requestPath = req.getRequestURI();
        String header = req.getHeader("Authorization");
        
        System.out.println("🔐 Authorization header: " + header + " for path: " + requestPath);

        try {
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                System.out.println("🔑 Extracted token: " + token);

                String email = jwtUtils.getUsernameFromToken(token);
                System.out.println("📧 Extracted email: " + email);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    System.out.println("👤 Loaded user: " + userDetails.getUsername());

                    if (jwtUtils.validateToken(token)) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails, null, userDetails.getAuthorities());

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        System.out.println("✅ User authenticated");
                    } else {
                        System.out.println("❌ Invalid token");
                    }
                }
            }

            chain.doFilter(request, response);
            
        } catch (Exception e) {
            System.out.println("❗ JWT Filter Exception: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace(); // Keep this for debugging
            
            // ONLY send error response if there was actually an Authorization header
            // This lets public endpoints (like registration) work without tokens
            if (header != null && header.startsWith("Bearer ")) {
                ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }
            
            // For requests without auth headers (public endpoints), just continue
            chain.doFilter(request, response);
        }
    }
}