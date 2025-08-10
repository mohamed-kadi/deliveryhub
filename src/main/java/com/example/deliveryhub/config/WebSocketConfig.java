// package com.example.deliveryhub.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.messaging.Message;
// import org.springframework.messaging.MessageChannel;
// import org.springframework.messaging.simp.config.ChannelRegistration;
// import org.springframework.messaging.simp.config.MessageBrokerRegistry;
// import org.springframework.messaging.simp.stomp.StompCommand;
// import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
// import org.springframework.messaging.support.ChannelInterceptor;
// import org.springframework.messaging.support.MessageHeaderAccessor;
// import org.springframework.web.socket.config.annotation.*;

// import lombok.RequiredArgsConstructor;

// @Configuration
// @RequiredArgsConstructor
// @EnableWebSocketMessageBroker
// public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

//     private final WebSocketJwtInterceptor jwtInterceptor;

//     @Override
//     public void registerStompEndpoints(StompEndpointRegistry registry) {
//         registry.addEndpoint("/ws")
//                .addInterceptors(jwtInterceptor)
//                .setAllowedOriginPatterns("*")
//                .withSockJS();
//     }

//     @Override
//     public void configureMessageBroker(MessageBrokerRegistry registry) {
//         registry.setApplicationDestinationPrefixes("/app");
//         //registry.enableSimpleBroker("/topic");

//         //===>the new paste
//                 // Enable simple broker for topics, queues, and user-specific destinations
//         registry.enableSimpleBroker("/topic", "/queue", "/user");
//         // Set user destination prefix for targeted messaging
//         registry.setUserDestinationPrefix("/user");
//         //<====== the end pf paste
//     }

//     @Override
//     public void configureClientInboundChannel(ChannelRegistration registration) {
//         registration.interceptors(new ChannelInterceptor() {
//             @Override
//             public Message<?> preSend(Message<?> message, MessageChannel channel) {
//                 StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
//                 if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    
//                     Object userObj = accessor.getSessionAttributes().get("user");
//                     if (userObj instanceof com.example.deliveryhub.model.User) {
//                         com.example.deliveryhub.model.User user = (com.example.deliveryhub.model.User) userObj;
//                         accessor.setUser(() -> user.getEmail());
//                     }
//                 }
                
//                 return message;
//             }
//         });
//     }
// }
package com.example.deliveryhub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketJwtInterceptor jwtInterceptor;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
               .addInterceptors(jwtInterceptor)
               .setAllowedOriginPatterns("*")
               .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        // Enable simple broker for topics, queues, and user-specific destinations
        registry.enableSimpleBroker("/topic", "/queue", "/user");
        // Set user destination prefix for targeted messaging
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
                if (accessor != null) {
                    log.info("STOMP Command: {}", accessor.getCommand());
                    
                    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                        log.info("STOMP CONNECT received");
                        Object userObj = accessor.getSessionAttributes().get("user");
                        if (userObj instanceof com.example.deliveryhub.model.User) {
                            com.example.deliveryhub.model.User user = (com.example.deliveryhub.model.User) userObj;
                            accessor.setUser(() -> user.getEmail());
                            log.info("Set user principal: {}", user.getEmail());
                        } else {
                            log.warn("No user found in session attributes");
                        }
                    } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                        log.info("STOMP DISCONNECT received");
                    } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                        log.info("STOMP SUBSCRIBE to: {}", accessor.getDestination());
                    } else if (StompCommand.SEND.equals(accessor.getCommand())) {
                        log.info("STOMP SEND to: {}", accessor.getDestination());
                        log.info("SEND payload size: {}", message.getPayload().toString().length());
                    }
                }
                
                return message;
            }
            
            @Override
            public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null && !sent) {
                    log.error("Failed to send STOMP message: {}", accessor.getCommand());
                }
            }
        });
    }
}