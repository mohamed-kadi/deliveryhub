package com.example.deliveryhub.controller;



import com.example.deliveryhub.dto.UserRegisterDTO;
import com.example.deliveryhub.dto.UserResponseDTO;
import com.example.deliveryhub.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRegisterDTO dto) {
        UserResponseDTO response = userService.registerUser(dto);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/protected")
    public ResponseEntity<String> protectedEndpoint() {
         return ResponseEntity.ok("You are authenticated!");
    }

}

