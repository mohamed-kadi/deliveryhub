import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';

// Customer pages
import MyDeliveries from './pages/customer/MyDeliveries';
import CreateDelivery from './pages/customer/CreateDelivery';

// Transporter pages
import AvailableJobs from './pages/transporter/AvailableJobs';
import TransporterDeliveries from './pages/transporter/MyDeliveries';

// Admin pages
import ManageTransporters from './pages/admin/ManageTransporters';
import Analytics from './pages/admin/Analytics';

// Shared pages
import Chat from './pages/shared/Chat';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              {/* Customer routes */}
              <Route 
                path="/deliveries" 
                element={
                  <ProtectedRoute requiredRole="CUSTOMER">
                    <Layout>
                      <MyDeliveries />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/deliveries/create" 
                element={
                  <ProtectedRoute requiredRole="CUSTOMER">
                    <Layout>
                      <CreateDelivery />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              {/* Transporter routes */}
              <Route 
                path="/jobs" 
                element={
                  <ProtectedRoute requiredRole="TRANSPORTER" requireApproval={true}>
                    <Layout>
                      <AvailableJobs />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/transporter/deliveries" 
                element={
                  <ProtectedRoute requiredRole="TRANSPORTER" requireApproval={true}>
                    <Layout>
                      <TransporterDeliveries />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute requiredRole="TRANSPORTER" requireApproval={true}>
                    <Layout>
                      <div>Messages (Coming Soon)</div>
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              {/* Admin routes */}
              <Route 
                path="/admin/transporters" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Layout>
                      <ManageTransporters />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Layout>
                      <Analytics />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              {/* Shared protected routes */}
              <Route 
                path="/chat/:deliveryId" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Chat />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Profile Settings (Coming Soon)</div>
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
