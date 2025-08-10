package com.example.deliveryhub.repository;

import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;



public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);

    List<User> findByRoleAndVerifiedFalse(Role role);

    long countByRole(Role role);

    List<User> findByRoleAndVerified(Role role, boolean verified);

    List<User> findByRoleAndVerifiedAndAvailableForDeliveries(Role role, boolean verified, boolean available);

    List<User> findByRoleAndVerifiedTrueOrderByIdDesc(Role role);
    List<User> findByRoleAndVerifiedTrue(Role role);

}
