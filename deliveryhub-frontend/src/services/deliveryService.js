import axios from "axios";

const API = "http://localhost:8080/api/deliveries";
const token = localStorage.getItem("token");

const authHeader = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const createDelivery = async (data) => {
  const res = await axios.post(API, data, authHeader);
  return res.data;
};

export const getMyDeliveries = async () => {
  const res = await axios.get(`${API}/my`, authHeader);
  return res.data;
};

export const getAvailableDeliveries = async () => {
    const res = await axios.get(`${API}/available`, authHeader);
    return res.data;
  };
  
  export const acceptDeliveryRequest = async (id) => {
    const res = await axios.post(`${API}/${id}/accept`, {}, authHeader);
    return res.data;
  };

  export const getAssignedDeliveries = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/api/deliveries/assigned", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status); // Debug log
    console.log("Response ok:", response.ok); // Debug log
  
    if (!response.ok) {
      throw new Error("Failed to fetch assigned deliveries");
    }
  
    return await response.json();
  };

  export const updateDeliveryStatus = async (deliveryId, status) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/deliveries/${deliveryId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to update delivery status");
    }
  
    return await response.json();
  };