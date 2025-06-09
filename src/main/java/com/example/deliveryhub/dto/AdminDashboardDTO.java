package com.example.deliveryhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardDTO {
    private long totalDeliveries;
    private long totalCustomers;
    private long totalTransporters;
    private long pendingDeliveries;
    private long assignedDeliveries;
    private long pickedUpDeliveries;
    private long deliveredDeliveries;
}
