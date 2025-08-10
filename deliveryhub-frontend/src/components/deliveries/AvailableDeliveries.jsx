import React from "react";

const AvailableDeliveries = ({ deliveries, onAccept }) => {
  return (
    <div>
      <h3>Available Deliveries</h3>
      {deliveries.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {deliveries.map((d) => (
            <li key={d.id}>
              {d.pickupCity} → {d.dropoffCity} | {d.itemType}
              <button onClick={() => onAccept(d.id)} style={{ marginLeft: "10px" }}>
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailableDeliveries;
