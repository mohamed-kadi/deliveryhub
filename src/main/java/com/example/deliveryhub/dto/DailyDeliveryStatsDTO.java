package com.example.deliveryhub.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DailyDeliveryStatsDTO {
    private LocalDate date;
    private String status;
    private Long count;
     
    


}
