package com.example.deliveryhub.websocket;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.deliveryhub.dto.ChatMessageDTO;
import com.example.deliveryhub.service.ChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api") 
@RequiredArgsConstructor
@Slf4j
public class WebSocketChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO chatMessageDTO, Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        
        log.info("📨 WebSocket message received from frontend");
        log.info("Message content: {}", chatMessageDTO);
        
        String authenticatedEmail = null;
        
        // Primary: Get from Principal (set by ChannelInterceptor)
        if (principal != null) {
            authenticatedEmail = principal.getName();
            log.info("Authenticated user from Principal: {}", authenticatedEmail);
        } else {
            // Fallback: Get from User object in session (set by HandshakeInterceptor)
            Object userObj = headerAccessor.getSessionAttributes().get("user");
            if (userObj instanceof com.example.deliveryhub.model.User) {
                com.example.deliveryhub.model.User user = (com.example.deliveryhub.model.User) userObj;
                authenticatedEmail = user.getEmail();
                log.info("Authenticated user from session: {}", authenticatedEmail);
            }
        }
        
        if (authenticatedEmail == null) {
            log.warn("Unauthorized WebSocket access attempt - no authenticated user found");
            throw new SecurityException("Unauthorized WebSocket access.");
        }

        try {
            log.info("Sending message to ChatService for user: {}", authenticatedEmail);
            
            // Send message securely
            ChatMessageDTO saved = chatService.sendMessage(authenticatedEmail, chatMessageDTO);

            // Broadcast to room: /topic/delivery.{matchId}.chat
            String destination = "/topic/delivery." + saved.getMatchId() + ".chat";
            messagingTemplate.convertAndSend(destination, saved);
            
            log.info("Message broadcast to {} with content: {}", destination, saved);
            
        } catch (Exception e) {
            log.error("Error sending message for user {}: {}", authenticatedEmail, e.getMessage());
            throw new RuntimeException("Failed to send message", e);
        }
    }

    @MessageMapping("/chat.read")
    public void markMessageAsRead(@Payload Long messageId, Principal principal) {
        if (principal == null)
            throw new SecurityException("Unauthorized");

        String email = principal.getName();
        ChatMessageDTO updated = chatService.markMessageAsRead(messageId, email);

        // 🔔 Notify the sender that their message was read
        String senderDestination = "/topic/chat.read." + updated.getSenderId();
        messagingTemplate.convertAndSend(senderDestination, updated);
    }
     
    // Add this method to your WebSocketChatController class:
    @GetMapping("/chat/unread-counts")
    public ResponseEntity<Map<Long, Integer>> getUnreadCounts(Principal principal) {
        if (principal == null) {
            throw new SecurityException("Unauthorized");
        }

        String email = principal.getName();
        Map<Long, Integer> counts = chatService.getUnreadCountsForUser(email);
        return ResponseEntity.ok(counts);
    }

    @MessageMapping("/chat.readAll")
    public void readAll(@Payload Long deliveryId, Principal principal) {
        if (principal == null) throw new SecurityException("Unauthorized");

        String me = principal.getName();
        List<Long> readIds = chatService.markAllMessagesAsReadForReceiver(deliveryId, me);

        // 1️⃣ reset my badge to zero
        messagingTemplate.convertAndSendToUser(
            me,
            "/queue/chat." + deliveryId + ".count",
            0
        );

        // 2️⃣ notify the *other* user which message‐IDs got read
        String other = chatService.getOtherParticipantEmail(deliveryId, me);
        messagingTemplate.convertAndSendToUser(
            other,
            "/queue/chat." + deliveryId + ".receipt",
            readIds
        );
    }

    
}