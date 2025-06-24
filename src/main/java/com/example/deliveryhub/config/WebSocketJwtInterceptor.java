package com.example.deliveryhub.config;

import com.example.deliveryhub.auth.JwtUtils;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class WebSocketJwtInterceptor implements HandshakeInterceptor {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        try {
            // Extract token from query string: ws://.../ws?token=xxx
            String query = request.getURI().getQuery(); // token=xxx
            if (query == null || !query.startsWith("token=")) return false;

            String token = query.substring("token=".length());
            String userEmail = jwtUtils.getUsernameFromToken(token);
            Optional<User> userOpt = userRepository.findByEmail(userEmail);

                        // boolean tokenValid = jwtUtils.validateToken(token);
                        // // --- DEBUG LOGGING ---
                        // System.out.println("[Handshake] token: " + token);
                        // System.out.println("[Handshake] userEmail: " + userEmail);
                        // System.out.println("[Handshake] user found: " + userOpt.isPresent());
                        // System.out.println("[Handshake] token valid: " + tokenValid);
                        // // --- END DEBUG LOGGING ---
            if (userOpt.isEmpty() || !jwtUtils.validateToken(token)) {
                return false;
            }

            attributes.put("user", userOpt.get());
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest req, ServerHttpResponse res, WebSocketHandler wsHandler, Exception ex) {
        // Do nothing
    }
}

