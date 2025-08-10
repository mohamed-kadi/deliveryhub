import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AdminDashboard from "./AdminDashboard";
import CustomerDashboard from "./CustomerDashboard";
import TransporterDashboard from "./TransporterDashboard";

const RoleBasedDashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Loading...</p>;

  switch (user.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "TRANSPORTER":
      return <TransporterDashboard />;
    case "CUSTOMER":
      return <CustomerDashboard />;
    default:
      return <p>Unknown role</p>;
  }
};

export default RoleBasedDashboard;
