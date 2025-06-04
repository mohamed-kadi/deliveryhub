package com.example.deliveryhub.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.deliveryhub.model.DeliveryRequest;
import com.example.deliveryhub.model.User;

public interface DeliveryRequestRepository extends  JpaRepository<DeliveryRequest, Long> {

    List<DeliveryRequest> findByCustomer(User user);

    List<DeliveryRequest> findByStatus(String status);
    
    Optional<DeliveryRequest> findByIdAndStatus(Long id, String status);
    
    List<DeliveryRequest> findByTransporterAndStatus(User transporter, String status);

}
