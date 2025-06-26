package com.example.deliveryhub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.deliveryhub.dto.RatingDTO;
import com.example.deliveryhub.model.Rating;
import com.example.deliveryhub.service.RatingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rating")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<?> submitrating(@RequestBody RatingDTO ratingDTO, Authentication auth) {
        try {
            String userEmail = auth.getName();
            Rating savedRating = ratingService.submitRating(ratingDTO, userEmail);
            return ResponseEntity.ok(savedRating);
        } catch (IllegalArgumentException | IllegalStateException | SecurityException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error submitting rating");
        }
    }


}
