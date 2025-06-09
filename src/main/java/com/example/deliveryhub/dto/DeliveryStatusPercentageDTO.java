package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DeliveryStatusPercentageDTO {
    private String status;
    private Long  count;


}
