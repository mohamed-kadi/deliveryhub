package com.example.deliveryhub.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.deliveryhub.dto.ChatMessageDTO;
import com.example.deliveryhub.dto.MessageReadEvent;
import com.example.deliveryhub.enums.MessageType;
import com.example.deliveryhub.model.ChatMessage;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.ChatMessageRepository;
import com.example.deliveryhub.repository.DeliveryRequestRepository;
import com.example.deliveryhub.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final DeliveryRequestRepository deliveryRequestRepository;


        public ChatMessageDTO sendMessage(String senderEmail, ChatMessageDTO dto) {
                // Step 1: Find sender by email
                User sender = userRepository.findByEmail(senderEmail)
                                .orElseThrow(() -> new RuntimeException("Sender not found"));
                if (!sender.getId().equals(dto.getSenderId())) {
                        throw new SecurityException("Sender ID does not match authenticated user");
                }

                DeliveryRequest delivery = deliveryRequestRepository.findById(dto.getMatchId())
                                .orElseThrow(() -> new RuntimeException("Delivery not found"));
                // Step 2: Check if sender is authorized to send messages for this delivery        
                if (!sender.getId().equals(delivery.getCustomer().getId())
                                && !sender.getId().equals(delivery.getTransporter().getId())) {
                        throw new SecurityException("User is not authorized to send messages for this delivery");
                }

                User receiver = sender.getRole() == Role.CUSTOMER ? delivery.getTransporter() : delivery.getCustomer();

                ChatMessage message = new ChatMessage();
                message.setSender(sender);
                message.setReceiver(receiver);
                message.setDelivery(delivery);
                message.setContent(dto.getContent());
                message.setTimestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now());
                message.setIsDelivered(true); // Assume message is delivered when saved
                message.setIsRead(false);
                message.setMessageType(dto.getMessageType());
                message.setFileUrl(dto.getFileUrl());
                message.setFileName(dto.getFileName());
                message.setLatitude(dto.getLatitude());
                message.setLongitude(dto.getLongitude());

                ChatMessage saved = chatMessageRepository.save(message);

                ChatMessageDTO responseDTO = ChatMessageDTO.builder()
                                .id(saved.getId())
                                .matchId(delivery.getId())
                                .senderId(sender.getId())
                                .senderName(sender.getFullName())
                                .senderRole(sender.getRole())
                                .content(saved.getContent())
                                .messageType(saved.getMessageType())
                                .timestamp(saved.getTimestamp())
                                .fileUrl(saved.getFileUrl())
                                .fileName(saved.getFileName())
                                .latitude(saved.getLatitude())
                                .longitude(saved.getLongitude())
                                .isRead(saved.getIsRead())
                                .isDelivered(saved.getIsDelivered())
                                .build();
                // ───────── new code ─────────
// 1️⃣ broadcast the chat message as you already do
messagingTemplate.convertAndSend(
    "/topic/delivery." + delivery.getId() + ".chat",
    responseDTO
);

// 2️⃣ compute the fresh unread‐count for the receiver
int newUnread = chatMessageRepository
    .countByDeliveryIdAndReceiverIdAndIsReadFalse(delivery.getId(), receiver.getId());

// 3️⃣ send it *only* to that user’s personal queue
messagingTemplate.convertAndSendToUser(
    receiver.getEmail(),
    "/queue/chat." + delivery.getId() + ".count",
    newUnread
);
// ───────── end new code ─────────


                // WEBSOCKET NOTIFICATION - Send to the chat room
                String destination = "/topic/delivery." + delivery.getId() + ".chat";
                messagingTemplate.convertAndSend(destination, responseDTO);

                // WEBSOCKET NOTIFICATION - Send notification to specific receiver
                String notificationDestination = "/user/" + receiver.getEmail() + "/queue/notifications";
                Map<String, Object> notification = new HashMap<>();
                notification.put("type", "NEW_MESSAGE");
                notification.put("deliveryId", delivery.getId());
                notification.put("senderName", sender.getFullName());
                notification.put("message", saved.getContent());
                notification.put("timestamp", saved.getTimestamp());
                messagingTemplate.convertAndSend(notificationDestination, notification);

                return responseDTO;
        }




    public List<ChatMessageDTO> getMessagesForDelivery(Long deliveryId) {
        DeliveryRequest delivery = deliveryRequestRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        return chatMessageRepository.findByDeliveryIdOrderByTimestampAsc(delivery.getId())
                .stream()
                .map(msg -> ChatMessageDTO.builder()
                        .id(msg.getId())
                        .matchId(deliveryId)
                        .senderId(msg.getSender().getId())
                        .senderName(msg.getSender().getFullName())
                        .senderRole(msg.getSender().getRole())
                        .content(msg.getContent())
                        .messageType(msg.getMessageType())
                        .timestamp(msg.getTimestamp())
                        .fileUrl(msg.getFileUrl())
                        .fileName(msg.getFileName())
                        .latitude(msg.getLatitude())
                        .longitude(msg.getLongitude())
                        .isRead(msg.getIsRead())
                        .isDelivered(msg.getIsDelivered())
                        .build()
                ).collect(Collectors.toList());
    }

        @Transactional
        public ChatMessageDTO markMessageAsRead(Long messageId, String authenticatedEmail) {
                ChatMessage message = chatMessageRepository.findById(messageId)
                                .orElseThrow(() -> new RuntimeException("Message not found"));

                // Only the receiver is allowed to mark it as read
                if (!message.getReceiver().getEmail().equals(authenticatedEmail)) {
                        throw new SecurityException("Only the receiver can mark the message as read.");
                }

                message.setIsRead(true);
                ChatMessage saved = chatMessageRepository.save(message);
                MessageReadEvent event = new MessageReadEvent(saved.getId(), saved.getDelivery().getId());
                String topic = "/topic/delivery." + saved.getDelivery().getId() + ".read";
                messagingTemplate.convertAndSend(topic, event);

                return ChatMessageDTO.builder()
                                .id(saved.getId())
                                .matchId(saved.getDelivery().getId())
                                .senderId(saved.getSender().getId())
                                .senderName(saved.getSender().getFullName())
                                .senderRole(saved.getSender().getRole())
                                .content(saved.getContent())
                                .messageType(saved.getMessageType())
                                .timestamp(saved.getTimestamp())
                                .fileUrl(saved.getFileUrl())
                                .fileName(saved.getFileName())
                                .latitude(saved.getLatitude())
                                .longitude(saved.getLongitude())
                                .isRead(saved.getIsRead())
                                .isDelivered(saved.getIsDelivered())
                                .build();
        }
        
//====> new code 
        @Transactional
public List<Long> markAllMessagesAsReadForReceiver(
        Long deliveryId, 
        String receiverEmail
) {
        User receiver = userRepository.findByEmail(receiverEmail)
                        .orElseThrow(() -> new RuntimeException("User not found"));

        // fetch and mark
        List<ChatMessage> unread = chatMessageRepository
                        .findByDeliveryIdAndReceiverIdAndIsReadFalse(deliveryId, receiver.getId());

        List<Long> ids = unread.stream()
                        .map(ChatMessage::getId)
                        .collect(Collectors.toList());

        unread.forEach(m -> m.setIsRead(true));
        chatMessageRepository.saveAll(unread);

        return ids;
}
//<===== end of new code

        // @Transactional
        // public void markAllMessagesAsReadForReceiver(Long deliveryId, String receiverEmail) {
        // // Find the receiver user
        // User receiver = userRepository.findByEmail(receiverEmail)
        //         .orElseThrow(() -> new RuntimeException("User not found"));
        
        // // Get all unread messages for this receiver in this delivery
        // List<ChatMessage> unreadMessages = chatMessageRepository
        //         .findByDeliveryIdAndReceiverIdAndIsReadFalse(deliveryId, receiver.getId());
        
        // // Mark them all as read
        // unreadMessages.forEach(message -> message.setIsRead(true));
        // chatMessageRepository.saveAll(unreadMessages);
        
        // System.out.println("Marked " + unreadMessages.size() + " unread messages as read for user " + receiverEmail + " in delivery " + deliveryId);
        // }


        public ChatMessageDTO sendFileMessage(
        String senderEmail,
        Long matchId,
        Long senderId,
        String senderName,
        Role senderRole,
        MultipartFile file
        ) throws IOException {

                User sender = userRepository.findByEmail(senderEmail)
                                .orElseThrow(() -> new RuntimeException("Sender not found"));

                if (!sender.getId().equals(senderId)) {
                        throw new SecurityException("Sender ID does not match authenticated user");
                }

                DeliveryRequest delivery = deliveryRequestRepository.findById(matchId)
                                .orElseThrow(() -> new RuntimeException("Delivery not found"));

                if (!sender.getId().equals(delivery.getCustomer().getId()) &&
                                !sender.getId().equals(delivery.getTransporter().getId())) {
                        throw new SecurityException("User is not authorized to send messages for this delivery");
                }

                // Simulate storing the file (this should be replaced with actual cloud storage)
                String fakeUrl = "http://localhost:8080/files/" + file.getOriginalFilename();

                User receiver = sender.getRole() == Role.CUSTOMER
                                ? delivery.getTransporter()
                                : delivery.getCustomer();

                ChatMessage message = new ChatMessage();
                message.setSender(sender);
                message.setReceiver(receiver);
                message.setDelivery(delivery);
                message.setContent(file.getOriginalFilename());
                message.setFileName(file.getOriginalFilename());
                message.setFileUrl(fakeUrl);
                message.setIsRead(false);
                message.setIsDelivered(true);
                message.setMessageType(MessageType.FILE);
                message.setTimestamp(LocalDateTime.now());

                ChatMessage saved = chatMessageRepository.save(message);

                return ChatMessageDTO.builder()
                                .id(saved.getId())
                                .matchId(delivery.getId())
                                .senderId(sender.getId())
                                .senderName(sender.getFullName())
                                .senderRole(sender.getRole())
                                .content(saved.getContent())
                                .messageType(saved.getMessageType())
                                .timestamp(saved.getTimestamp())
                                .fileUrl(saved.getFileUrl())
                                .fileName(saved.getFileName())
                                .isRead(saved.getIsRead())
                                .isDelivered(saved.getIsDelivered())
                                .build();
        }

        public Map<Long, Integer> getUnreadCountsForUser(String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Map<Long, Integer> unreadCounts = new HashMap<>();

                // Get deliveries where user is customer (this method exists)
                List<DeliveryRequest> customerDeliveries = deliveryRequestRepository.findByCustomer(user);

                // For transporter deliveries, we need to add this method OR use a different approach
                // Let's use a simple query for now
                List<DeliveryRequest> allDeliveries = deliveryRequestRepository.findAll();
                List<DeliveryRequest> transporterDeliveries = allDeliveries.stream()
                                .filter(d -> d.getTransporter() != null
                                                && d.getTransporter().getId().equals(user.getId()))
                                .collect(Collectors.toList());

                // Combine both lists
                List<DeliveryRequest> allUserDeliveries = new ArrayList<>();
                allUserDeliveries.addAll(customerDeliveries);
                allUserDeliveries.addAll(transporterDeliveries);

                for (DeliveryRequest delivery : allUserDeliveries) {
                        int unreadCount = chatMessageRepository
                                        .countByDeliveryIdAndReceiverIdAndIsReadFalse(delivery.getId(), user.getId());

                        if (unreadCount > 0) {
                                unreadCounts.put(delivery.getId(), unreadCount);
                        }
                }

                return unreadCounts;
        }

        public String getOtherParticipantEmail(Long deliveryId, String meEmail) {
        DeliveryRequest d = deliveryRequestRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        String cust = d.getCustomer().getEmail();
        String transp = d.getTransporter().getEmail();
        return cust.equals(meEmail) ? transp : cust;
        }
        
        


}
