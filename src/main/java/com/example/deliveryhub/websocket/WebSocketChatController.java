package com.example.deliveryhub.websocket;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.deliveryhub.dto.ChatMessageDTO;
import com.example.deliveryhub.service.ChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO chatMessageDTO, Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        
        String authenticatedEmail = null;
        
        // Primary: Get from Principal (set by ChannelInterceptor)
        if (principal != null) {
            authenticatedEmail = principal.getName();
        } else {
            // Fallback: Get from User object in session (set by HandshakeInterceptor)
            Object userObj = headerAccessor.getSessionAttributes().get("user");
            if (userObj instanceof com.example.deliveryhub.model.User) {
                com.example.deliveryhub.model.User user = (com.example.deliveryhub.model.User) userObj;
                authenticatedEmail = user.getEmail();
            }
        }
        
        if (authenticatedEmail == null) {
            log.warn("Unauthorized WebSocket access attempt - no authenticated user found");
            throw new SecurityException("Unauthorized WebSocket access.");
        }

        try {
            // Send message securely
            ChatMessageDTO saved = chatService.sendMessage(authenticatedEmail, chatMessageDTO);

            // Broadcast to room: /topic/delivery.{matchId}.chat
            String destination = "/topic/delivery." + saved.getMatchId() + ".chat";
            messagingTemplate.convertAndSend(destination, saved);
            
            log.debug("Message sent successfully to {} by user {}", destination, authenticatedEmail);
            
        } catch (Exception e) {
            log.error("Error sending message for user {}: {}", authenticatedEmail, e.getMessage());
            throw new RuntimeException("Failed to send message", e);
        }
    }

    @MessageMapping("/chat.read")
    public void markMessageAsRead(@Payload Long messageId, Principal principal) {
      if (principal == null) throw new SecurityException("Unauthorized");

      String email = principal.getName();
      ChatMessageDTO updated = chatService.markMessageAsRead(messageId, email);

      // 🔔 Notify the sender that their message was read
      String senderDestination = "/topic/chat.read." + updated.getSenderId();
      messagingTemplate.convertAndSend(senderDestination, updated);
     }
}