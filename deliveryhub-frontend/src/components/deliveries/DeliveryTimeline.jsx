import React from "react";
import "./DeliveryTimeline.css"; // we'll add styles in the next step

const steps = [
  { key: "PENDING", label: "⭕ Pending" },
  { key: "ASSIGNED", label: "📦 Assigned" },
  { key: "PICKED_UP", label: "🚚 Picked Up" },
  { key: "DELIVERED", label: "✅ Delivered" },
];

const DeliveryTimeline = ({ status }) => {
  const currentIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className="timeline">
      {steps.map((step, index) => (
        <span
          key={step.key}
          className={`timeline-step ${
            index < currentIndex
              ? "completed"
              : index === currentIndex
              ? "active"
              : "upcoming"
          }`}
        >
          {step.label}
          {index < steps.length - 1 && <span className="arrow">→</span>}
        </span>
      ))}
    </div>
  );
};

export default DeliveryTimeline;
