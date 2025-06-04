package com.example.deliveryhub.dto;

import com.example.deliveryhub.model.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransporterAdminDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private Role role;
    private boolean verified; // Indicates if the transporter is verified

    // private String vehicleType; // Type of vehicle used by the transporter
    // private String licensePlate; // Vehicle license plate number
    // private String location; // Current location of the transporter
    // private double rating; // Average rating of the transporter
    // private int completedDeliveries; // Number of deliveries completed by the transporter
    // private int pendingDeliveries; // Number of deliveries pending for the transporter
    // private int totalDeliveries; // Total number of deliveries handled by the transporter
    // private String profilePictureUrl; // URL of the transporter's profile picture
    // private String vehiclePictureUrl; // URL of the transporter's vehicle picture
    // private String bio; // Short biography or description of the transporter
    // private String licenseNumber; // Transporter's driving license number
    // private String insuranceDetails; // Details of the transporter's insurance
    // private String registrationDate; // Date when the transporter registered on the platform
    // private String lastActive; // Last active date/time of the transporter
    // private String status; // Current status of the transporter (e.g., active, inactive, suspended)
    // private String feedback; // Feedback or comments from customers about the transporter
    // private String vehicleModel; // Model of the transporter's vehicle
    // private String vehicleColor; // Color of the transporter's vehicle
    // private String vehicleYear; // Year of manufacture of the transporter's vehicle
    // private String transporterType; // Type of transporter (e.g., individual, company)
    // private String companyName; // Name of the transporter's company, if applicable
    // private String companyAddress; // Address of the transporter's company, if applicable
    // private String companyPhone; // Phone number of the transporter's company, if applicable
    // private String companyEmail; // Email address of the transporter's company, if applicable
    // private String companyWebsite; // Website of the transporter's company, if applicable
    // private String companyLogoUrl; // URL of the transporter's company logo, if applicable
    // private String serviceArea; // Geographical area where the transporter operates
    // private String serviceHours; // Operating hours of the transporter
    // private String paymentMethods; // Accepted payment methods by the transporter
    // private String additionalNotes; // Any additional notes or comments about the transporter
    // private String lastDeliveryDate; // Date of the last delivery made by the transporter
    // private String nextAvailableDate; // Date when the transporter will be available for the next delivery
    // private String preferredDeliveryType; // Preferred type of delivery (e.g., local, long-distance)
    // private String preferredPaymentType; // Preferred payment type (e.g., cash, card, online)
    // private String emergencyContact; // Emergency contact details for the transporter
    // private String emergencyContactPhone; // Phone number of the emergency contact
    // private String emergencyContactEmail; // Email address of the emergency contact
    // private String transportLicense; // Transport license details of the transporter
    // private String transportLicenseExpiry; // Expiry date of the transport license
    // private String insuranceExpiry; // Expiry date of the transporter's insurance
    // private String vehicleInspectionDate; // Date of the last vehicle inspection
    // private String vehicleInspectionStatus; // Status of the last vehicle inspection (e.g., passed, failed)
    // private String vehicleRegistrationDate; // Date when the vehicle was registered
    // private String vehicleRegistrationStatus; // Status of the vehicle registration (e.g., valid, expired)
    // private String deliveryPreferences; // Transporter's preferences for handling deliveries
    // private String specialRequirements; // Any special requirements or conditions for the transporter
    // private String availabilityStatus; // Current availability status of the transporter
    // private String lastLocationUpdate; // Timestamp of the last location update for the transporter
    // private String feedbackRating; // Average feedback rating from customers
    // private String feedbackComments; // Comments or reviews from customers about the transporter
    // private String serviceRating; // Rating of the transporter's service quality
    // private String serviceComments; // Comments or reviews about the transporter's service
    // private String deliveryHistory; // Summary of the transporter's delivery history
    // private String deliveryPerformance; // Performance metrics of the transporter (e.g., on-time delivery rate)
    // private String deliverySuccessRate; // Percentage of successful deliveries made by the transporter
    // private String deliveryFailureRate; // Percentage of failed deliveries made by the transporter
    // private String deliveryCancellationRate; // Percentage of deliveries cancelled by the transporter
    // private String deliveryDelayRate; // Percentage of deliveries delayed by the transporter
}
