package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransporterCompletionStatsDTO {
    private String transporterEmail;
    private Long totalCompleted;
    private Double averageCompletionTime; // in days


}
