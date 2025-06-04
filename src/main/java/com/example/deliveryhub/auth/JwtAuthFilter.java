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

    // @Override
    // public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
    //         throws IOException, ServletException {

    //     HttpServletRequest req = (HttpServletRequest) request;
    //     String header = req.getHeader("Authorization");

    //     if (header != null && header.startsWith("Bearer ")) {
    //         String token = header.substring(7);
    //         String email = jwtUtils.getUsernameFromToken(token);

    //         if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    //             UserDetails userDetails = userDetailsService.loadUserByUsername(email);

    //             if (jwtUtils.validateToken(token)) {
    //                 UsernamePasswordAuthenticationToken authToken =
    //                         new UsernamePasswordAuthenticationToken(
    //                                 userDetails, null, userDetails.getAuthorities());

    //                 authToken.setDetails(
    //                         new WebAuthenticationDetailsSource().buildDetails(req)
    //                 );

    //                 SecurityContextHolder.getContext().setAuthentication(authToken);
    //             }
    //         }
    //     }

    //     chain.doFilter(request, response);
    // }

    //////////////////////////////////
    /// 
    @Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {

    HttpServletRequest req = (HttpServletRequest) request;
    String header = req.getHeader("Authorization");
    System.out.println("🔐 Authorization header: " + header);

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
        ((HttpServletResponse) response).sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid token");
    }
}

}

