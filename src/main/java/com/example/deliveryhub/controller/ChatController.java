package com.example.deliveryhub.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.deliveryhub.dto.ChatMessageDTO;
import com.example.deliveryhub.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @RequestBody ChatMessageDTO messageDTO,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails
    ) {
        String senderEmail = userDetails.getUsername(); // From token
        return ResponseEntity.ok(chatService.sendMessage(senderEmail, messageDTO));
    }

    @GetMapping("/delivery/{deliveryId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(
            @PathVariable Long deliveryId, Principal principal
    ) {


        // Then get all messages (now with updated read status)
        List<ChatMessageDTO> messages = chatService.getMessagesForDelivery(deliveryId);
         return ResponseEntity.ok(messages);
      }

    @PostMapping("/delivery/{deliveryId}/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(
              @PathVariable Long deliveryId,
              Principal principal
    ) {
          String userEmail = principal.getName();
          chatService.markAllMessagesAsReadForReceiver(deliveryId, userEmail);
          return ResponseEntity.ok().build();
      }

    @PatchMapping("/{messageId}/read")
    public ResponseEntity<ChatMessageDTO> markAsRead(
        @PathVariable Long messageId,
        Principal principal) {
          String userEmail = principal.getName();
          ChatMessageDTO updated = chatService.markMessageAsRead(messageId, userEmail);
        return ResponseEntity.ok(updated);
    }

}
