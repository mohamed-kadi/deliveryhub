package com.example.deliveryhub.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.deliveryhub.model.TransporterPricing;
import com.example.deliveryhub.model.User;

public interface TransporterPricingRepository extends  JpaRepository<TransporterPricing, Long> {

    Optional<TransporterPricing> findByTransporter(User transporter);

}
