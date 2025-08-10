package com.example.deliveryhub.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.deliveryhub.dto.ChatMessageDTO;
import com.example.deliveryhub.model.Role;
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

    @PostMapping(value = "/send-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChatMessageDTO> sendFileMessage(
            @RequestParam("matchId") Long matchId,
            @RequestParam("senderId") Long senderId,
            @RequestParam("senderName") String senderName,
            @RequestParam("senderRole") Role senderRole,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails
    ) throws IOException {
        String senderEmail = userDetails.getUsername();
        return ResponseEntity.ok(chatService.sendFileMessage(
                senderEmail, matchId, senderId, senderName, senderRole, file));
    }


    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/chat/";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/chat/" + fileName;
            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("File upload failed: " + e.getMessage());
        }
    }
}
