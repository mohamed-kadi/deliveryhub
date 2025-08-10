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
        //=========> start paste
                try {
            // Get the full query string
            String query = request.getURI().getQuery();
            if (query == null || query.isEmpty()) {
                System.out.println("No query parameters found");
                return false;
            }

            // Extract token from query parameters
            String token = null;
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("token=")) {
                    token = param.substring("token=".length());
                    break;
                }
            }

            if (token == null || token.isEmpty()) {
                System.out.println("No token found in query parameters");
                return false;
            }

            // Validate token
            if (!jwtUtils.validateToken(token)) {
                System.out.println("Invalid token");
                return false;
            }

            // Extract user email from token
            String userEmail = jwtUtils.getUsernameFromToken(token);
            Optional<User> userOpt = userRepository.findByEmail(userEmail);

            if (userOpt.isEmpty()) {
                System.out.println("User not found for email: " + userEmail);
                return false;
            }

            // Store user in attributes for later use
            attributes.put("user", userOpt.get());
            System.out.println("WebSocket handshake successful for user: " + userEmail);
            return true;

        } catch (Exception e) {
            System.err.println("Error in WebSocket handshake: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
        //<===== end of paste
        // try {
        //     // Extract token from query string: ws://.../ws?token=xxx
        //     String query = request.getURI().getQuery(); // token=xxx
        //     if (query == null || !query.startsWith("token="))
        //      return false;

        //     String token = query.substring("token=".length());
        //     String userEmail = jwtUtils.getUsernameFromToken(token);
        //     Optional<User> userOpt = userRepository.findByEmail(userEmail);

        //     if (userOpt.isEmpty() || !jwtUtils.validateToken(token)) {
        //         return false;
        //     }

        //     attributes.put("user", userOpt.get());
        //     return true;

        // } catch (Exception e) {
        //     return false;
        // }
    }

    @Override
    public void afterHandshake(ServerHttpRequest req, ServerHttpResponse res, WebSocketHandler wsHandler, Exception ex) {
        // Do nothing
    }
}

