package com.example.deliveryhub.repository;

import com.example.deliveryhub.model.RefreshToken;
import com.example.deliveryhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);
    
    Optional<RefreshToken> findByUser(User user);
    
    void deleteByUser(User user);
    
    void deleteByExpiryDateBefore(LocalDateTime now);
    
    boolean existsByToken(String token);
}
