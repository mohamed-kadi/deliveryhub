package com.example.deliveryhub.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.deliveryhub.dto.TransporterAdminDTO;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;

    public List<TransporterAdminDTO> getPendingTransporters() {
        return userRepository.findByRoleAndVerifiedFalse(Role.TRANSPORTER)
                .stream()
                .map(user -> {
                    TransporterAdminDTO dto = new TransporterAdminDTO();
                    dto.setId(user.getId());
                    dto.setFullName(user.getFullName());
                    dto.setEmail(user.getEmail());
                    dto.setPhone(user.getPhone());
                    dto.setRole(user.getRole());
                    dto.setVerified(user.isVerified());
                    return dto;

                }).collect(Collectors.toList());

    }

    public TransporterAdminDTO verifyTransporter(Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transporter not found"));

        if (user.getRole() != Role.TRANSPORTER || user.isVerified()) {
            throw new RuntimeException("Invalid transporter or already verified");
        }

        user.setVerified(true);
        userRepository.save(user);

        TransporterAdminDTO dto = new TransporterAdminDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setVerified(user.isVerified());

        return dto;
    }
}
