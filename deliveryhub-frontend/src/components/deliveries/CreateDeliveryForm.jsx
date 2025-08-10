import React, { useState } from "react";

const CreateDeliveryForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    pickupCity: "",
    dropoffCity: "",
    itemType: "",
    description: "",
    pickupDate: "",
    weightKg: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate(formData);
    setFormData({
      pickupCity: "",
      dropoffCity: "",
      itemType: "",
      description: "",
      pickupDate: "",
      weightKg: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Delivery</h3>
      <input name="pickupCity" placeholder="Pickup City" value={formData.pickupCity} onChange={handleChange} />
      <input name="dropoffCity" placeholder="Dropoff City" value={formData.dropoffCity} onChange={handleChange} />
      <input name="itemType" placeholder="Item Type" value={formData.itemType} onChange={handleChange} />
      <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
      <input name="pickupDate" type="date" value={formData.pickupDate} onChange={handleChange} />
      <input name="weightKg" type="number" step="0.1" placeholder="Weight (kg)" value={formData.weightKg} onChange={handleChange} />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateDeliveryForm;
