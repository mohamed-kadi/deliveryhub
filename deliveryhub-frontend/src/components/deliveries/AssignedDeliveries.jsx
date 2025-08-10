import React from "react";

const AssignedDeliveries = ({ deliveries, onStatusChange }) => {
    if (!deliveries || deliveries.length === 0) {
      return <p>No assigned deliveries yet.</p>;
    }
  
    return (
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            <strong>{delivery.pickupCity} → {delivery.dropoffCity}</strong><br />
            Item: {delivery.itemType} | Status: {delivery.status}<br />
  
            {delivery.status === "ASSIGNED" && (
              <button onClick={() => onStatusChange(delivery.id, "PICKED_UP")}>
                Mark as Picked Up
              </button>
            )}
  
            {delivery.status === "PICKED_UP" && (
              <button onClick={() => onStatusChange(delivery.id, "DELIVERED")}>
                Mark as Delivered
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };
  
  export default AssignedDeliveries;
  