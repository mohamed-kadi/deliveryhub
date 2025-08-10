package com.example.deliveryhub.enums;


public enum DeclineReason {
    FULL_CAPACITY("Vehicle is at full capacity"),
    TIME_CONFILICT("Schedule conflict"),
    ROUTE_MISMATCH("Route doesn't match my travel plans"),
    DISTANCE_TOO_FAR("Pickup/delivery location is too  far"),
    ITEM_NOT_ACCEPTED("Item type not accepted"),
    OTHER("Other reasons");

    private final String description;
    
    DeclineReason(String description) {
        this.description = description;
    }   

    public String getDescription() {
        return description;
    }
    

}
