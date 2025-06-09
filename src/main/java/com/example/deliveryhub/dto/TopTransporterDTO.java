package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopTransporterDTO {
    private String transporterEmail;
    private Long completedCount;

}
