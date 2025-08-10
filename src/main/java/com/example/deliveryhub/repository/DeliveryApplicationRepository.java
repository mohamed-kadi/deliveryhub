package com.example.deliveryhub.repository;

import com.example.deliveryhub.model.DeliveryApplication;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DeliveryApplicationRepository extends JpaRepository<DeliveryApplication, Long> {
    List<DeliveryApplication> findByDeliveryRequest(DeliveryRequest deliveryRequest);
    List<DeliveryApplication> findByTransporter(User transporter);
    Optional<DeliveryApplication> findByDeliveryRequestAndTransporter(DeliveryRequest deliveryRequest, User transporter);
    boolean existsByDeliveryRequestAndTransporter(DeliveryRequest deliveryRequest, User transporter);
}
