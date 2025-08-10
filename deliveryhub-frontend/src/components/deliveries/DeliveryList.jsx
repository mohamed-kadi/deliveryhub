import React from "react";
import DeliveryTimeline from "./DeliveryTimeline";

const DeliveryList = ({ deliveries }) => {
  return (
    <ul>
      {deliveries.map((delivery) => (
        <li key={delivery.id} style={{ marginBottom: "16px" }}>
          <strong>{delivery.pickupCity} → {delivery.dropoffCity}</strong><br />
          Item: {delivery.itemType} | Status: {delivery.status}
          <DeliveryTimeline status={delivery.status} />
        </li>
      ))}
    </ul>
  );
};

export default DeliveryList;
