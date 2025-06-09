package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor         
public class TopCityDTO {
    private String city;
    private Long count;
}
