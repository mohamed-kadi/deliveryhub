// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../contexts/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useContext(AuthContext);
//   const token = localStorage.getItem("token");

//   if (!token || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
// // This component checks if the user is authenticated by verifying the presence of a token and user context.


// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken } from "../services/authService";

export default function ProtectedRoute ({ children }) {
  const { user, isAuthenticated } = useAuth();
  const token = getAccessToken();


  if (!token || !isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

//export default ProtectedRoute;

