package com.example.deliveryhub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.deliveryhub.model.ChatMessage;

import com.example.deliveryhub.model.User;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long>{


    //  Get all messages for a delivery (sorted by time)
    List<ChatMessage> findByDeliveryIdOrderByTimestampAsc(Long deliveryId);


     //  Optional: Load all messages between 2 users regardless of delivery
    List<ChatMessage> findBySenderOrReceiver(User sender, User receiver);

    List<ChatMessage> findByDeliveryIdAndReceiverIdAndIsReadFalse(Long deliveryId, Long receiverId);

}
