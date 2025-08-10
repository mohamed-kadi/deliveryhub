// src/App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedDashboard from "./pages/RoleBasedDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const { loading } = useAuth();

  // Show a splash/loading screen while we’re checking tokens & fetching the user
  if (loading) {
    return (
      <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh' }}>
        <div>Loading…</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protect all dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

