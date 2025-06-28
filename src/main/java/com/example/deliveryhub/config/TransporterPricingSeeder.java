package com.example.deliveryhub.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.deliveryhub.model.TransporterPricing;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.repository.TransporterPricingRepository;
import com.example.deliveryhub.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TransporterPricingSeeder implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final TransporterPricingRepository pricingRepository;

    @Override
    public void run(String... args) {
        User transporter = userRepository.findByEmail("ali@transporter.com").orElseThrow();

        if (pricingRepository.findByTransporter(transporter).isEmpty()) {
            pricingRepository.save(TransporterPricing.builder()
                .transporter(transporter)
                .ratePerKg(2.5)
                .fixedPriceUnderThreshold(20.0)
                .weightThreshold(10.0)
                .currency("EUR")
                .build());
        }
    }

}
