import React, { useState, useEffect } from 'react';
import { Truck, Package, Clock, Euro, MessageCircle, MapPin, CheckCircle, ArrowRight, RefreshCw, User, Calendar, Plus, Search, X } from 'lucide-react';
import apiClient from '../services/apiClient';
import ChatSidebar from '../components/ChatSidebar';
import useUnreadMessages from '../hooks/useUnreadMessages';
import { useAuth } from '../contexts/AuthContext';
// the new restructuring imports 
import StatCard from '../components/shared/StatCard';
import TabNavigation from '../components/shared/TabNavigation';
import DeliveryCard from '../components/shared/DeliveryCard';
import RatingModal from '../components/shared/RatingModal';
import TransporterProfileHeader from '../components/TransporterProfileHeader';
import StatusUpdateModal from '../components/shared/StatusUpdateModal';
import DeclineModal from '../components/shared/DeclineModal';
import ViewDetailsModal from '../components/shared/ViewDetailsModal';
import AvailableJobDetailsModal from '../components/shared/AvailableJobDetailsModal';
import CustomerRatingCard from '../components/shared/CustomerRatingCard';
import RouteManagement from '../components/transporter/RouteManagement';
import PricingConfiguration from '../components/transporter/PricingConfiguration';
import { calculateTimeRemaining, getPaymentStatusColor } from '../utils/transporterUtils';
import useWebSocket from '../hooks/useWebSocket';

const TransporterDashboard = () => {
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('available');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatDelivery, setSelectedChatDelivery] = useState(null);
  const { getUnreadCount, markDeliveryAsRead, handleNewMessage, handleMessageRead } = useUnreadMessages();


  // 🔔 Global notifications for TransporterDashboard
  
 useWebSocket(
      null,
      null,
      (notification) => {
        if (notification.type === 'NEW_MESSAGE') {
          handleNewMessage({ matchId: notification.deliveryId });
        }
      }
    );
  
  const [newStatus, setNewStatus] = useState('');

  const [pricingConfig, setPricingConfig] = useState({
    ratePerKg: '',
    fixedPriceUnderThreshold: '',
    weightThreshold: '',
    currency: 'EUR'
  });

  const [pricingExists, setPricingExists] = useState(false);
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [isAvailable, setIsAvailable] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [selectedViewDelivery, setSelectedViewDelivery] = useState(null);
  const [showAvailableJobDetails, setShowAvailableJobDetails] = useState(false);
  const [selectedAvailableJob, setSelectedAvailableJob] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRatingDelivery, setSelectedRatingDelivery] = useState(null);
  const [canRateDeliveries, setCanRateDeliveries] = useState({});
  const [hoveredCustomer, setHoveredCustomer] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { user } = useAuth(); // Add near the top with other hooks
  


  // Open chat for a delivery
  const openChat = (delivery) => {
    setSelectedChatDelivery(delivery);
    setChatOpen(true);
    markDeliveryAsRead(delivery.id);
  };

  // Close chat
  const closeChat = () => {
    setChatOpen(false);
    setSelectedChatDelivery(null);
  };

  // ===== CONSTANTS & CONFIG =====
  //const API_BASE = 'http://localhost:8080/api';

  // ===== HELPER FUNCTIONS =====

  const calculateEstimatedEarnings = (weightKg) => {
    if (!pricingConfig.ratePerKg || !weightKg) return 0;
    
    const weight = parseFloat(weightKg);
    const threshold = parseFloat(pricingConfig.weightThreshold) || 10;
    const ratePerKg = parseFloat(pricingConfig.ratePerKg);
    const fixedPrice = parseFloat(pricingConfig.fixedPriceUnderThreshold);
    
    if (weight <= threshold && fixedPrice) {
      return fixedPrice;
    }
    return weight * ratePerKg;
  };


  const calculateDisplayEarnings = (delivery) => {
    if (!pricingConfig.ratePerKg || !delivery.weightKg) return 0;
    return calculateEstimatedEarnings(delivery.weightKg || 0);
  };

  // ===== STYLES OBJECT =====
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '24px',
      paddingBottom: '24px'
    },
    headerTitle: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#1a202c',
      margin: 0
    },
    headerSubtitle: {
      fontSize: '14px',
      color: '#718096',
      marginTop: '4px'
    },
    button: {
      padding: '10px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    buttonPrimary: {
      backgroundColor: '#3182ce',
      color: 'white'
    },
    buttonSuccess: {
      backgroundColor: '#38a169',
      color: 'white'
    },
    buttonWarning: {
      backgroundColor: '#d69e2e',
      color: 'white'
    },
    buttonSecondary: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 20px'
    },
    grid: {
      display: 'grid',
      gap: '24px'
    },
    grid4: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      marginBottom: '32px'
    },
    card: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1a202c',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statLabel: {
      fontSize: '14px',
      color: '#718096',
      margin: 0
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1a202c',
      margin: '4px 0 0 0'
    },
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: '24px'
    },
    tab: {
      padding: '12px 24px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      borderBottom: '2px solid transparent',
      transition: 'all 0.2s'
    },
    tabActive: {
      color: '#3182ce',
      borderBottomColor: '#3182ce'
    },
    tabInactive: {
      color: '#718096'
    },
    deliveryCard: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '16px',
      transition: 'all 0.2s',
      cursor: 'pointer'
    },
    deliveryCardHover: {
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)'
    },
    deliveryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    deliveryId: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1a202c'
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    deliveryRoute: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
      fontSize: '16px',
      color: '#4a5568'
    },
    deliveryDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    detailLabel: {
      fontSize: '12px',
      color: '#718096',
      fontWeight: '500'
    },
    detailValue: {
      fontSize: '14px',
      color: '#1a202c',
      fontWeight: '500'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      marginTop: '20px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '400px',
      width: '100%'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1a202c'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 20px',
      color: '#718096'
    },
    emptyIcon: {
      width: '48px',
      height: '48px',
      margin: '0 auto 16px',
      color: '#cbd5e0'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      flexDirection: 'column'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #3182ce',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    customerHover: {
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#ebf8ff'
      }
    },
  
    hoverCard: {
      position: 'absolute',
      top: '100%',
      left: '0',
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      zIndex: 1000,
      minWidth: '280px',
      animation: 'fadeIn 0.2s ease-in-out'
    }
  };

  // ===== DATA FETCHING FUNCTIONS =====
  
  const fetchAvailableDeliveries = async () => {
    try {
      const response = await apiClient.get('/deliveries/available');
      setAvailableDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching available deliveries:', error);
    }
  };
  
  const fetchAssignedDeliveries = async () => {
    try {
      const response = await apiClient.get('/deliveries/assigned');
      const data = response.data;

      setAssignedDeliveries(data);
        
      const statuses = {};
      for (const delivery of data) {
        try {
          const statusResponse = await apiClient.get(`/payment/${delivery.id}/status`);
          const statusText = statusResponse.data;
          statuses[delivery.id] = statusText.replace(/"/g, '');
        } catch (error) {
          console.log(`Payment status not available for delivery ${delivery.id}`);
        }
      }
      setPaymentStatuses(statuses);
        
      // Check rating permissions for delivered deliveries
      const ratingPerms = {};
      for (const delivery of data) {
        if (delivery.status === 'DELIVERED') {
          ratingPerms[delivery.id] = await checkCanRate(delivery.id);
        }
      }
      setCanRateDeliveries(ratingPerms);
    } catch (error) {
      console.error('Error fetching assigned deliveries:', error);
    }
  };
  
  const fetchPricingConfig = async () => {
    try {
      const response = await apiClient.get('/pricing/my-config');
      setPricingConfig(response.data);
      setPricingExists(true);
    } catch (error) {
      console.error('Error fetching pricing config:', error);
      if (error.response?.status === 404) {
        setPricingExists(false);
      } else {
        setPricingExists(false);
      }
    }
  };

  const fetchAvailabilityStatus = async () => {
    try {
      const response = await apiClient.get('/users/availability');
      setIsAvailable(response.data);
    } catch (error) {
      console.error('Error fetching availability status:', error);
    }
  };

  // ===== AVAILABILITY FUNCTIONS =====
  
  const updateAvailabilityStatus = async (available) => {
    setLoadingAvailability(true);
    try {
      await apiClient.put(`/users/availability?available=${available}`);
      setIsAvailable(available);
    } catch (error) {
      console.error('Error updating availability status:', error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await apiClient.get('/routes/my-routes');
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };
  
  // ===== ROUTE MANAGEMENT FUNCTIONS =====
  
  
  // ===== PRICING FUNCTIONS =====
  

  // ===== DELIVERY ACTION FUNCTIONS =====

  const acceptDelivery = async (deliveryId) => {
    try {
      await apiClient.post(`/deliveries/${deliveryId}/accept`);
      await fetchAvailableDeliveries();
      await fetchAssignedDeliveries();
    } catch (error) {
      console.error('Error accepting delivery:', error);
    }
  };

  const acceptDeliveryRequest = async (deliveryId) => {
    try {
      await apiClient.post(`/deliveries/${deliveryId}/accept-request`);
      await fetchAssignedDeliveries();
      alert('Delivery request accepted successfully!');
    } catch (error) {
      console.error('Error accepting delivery request:', error);
      const errorMessage = error.response?.data || error.message || 'Failed to accept delivery request';
      alert(errorMessage);
    }
  };

  
  const applyToDelivery = async (deliveryId) => {
    try {
      await apiClient.post(`/deliveries/${deliveryId}/apply`);
      await fetchAvailableDeliveries();
      await fetchMyApplications();
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to delivery:', error);
      const errorMessage = error.response?.data || error.message || 'Failed to apply to delivery';
      alert(errorMessage);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const response = await apiClient.get('/applications/my');
      setMyApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // ===== RATING FUNCTIONS =====

  const checkCanRate = async (deliveryId) => {
    try {
      const response = await apiClient.get(`/deliveries/${deliveryId}/can-rate`);
      return response.data;
    } catch (error) {
      console.error('Error checking rating permission:', error);
      return false;
    }
  };

  // ===== PAYMENT FUNCTIONS =====  

  const markCashPayment = async (deliveryId) => {
    try {
      await apiClient.post(`/payment/${deliveryId}/mark-cash-paid`);
      await fetchAssignedDeliveries();
    } catch (error) {
      console.error('Error marking cash payment:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchAvailableDeliveries(),
      fetchAssignedDeliveries(),
      fetchPricingConfig(), 
      fetchAvailabilityStatus(),
      fetchRoutes(),
      fetchMyApplications()
    ]);
    setLoading(false);
  };


  // ===== REACT HOOKS =====
  
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAvailableDeliveries(), 
        fetchAssignedDeliveries(), 
        fetchPricingConfig(), 
        fetchAvailabilityStatus(),
        fetchRoutes()
      ]);
      setLoading(false);
    };
    
    loadInitialData();
  }, []);

// ===== CALCULATED VALUES =====
  const stats = {
    available: availableDeliveries.length,
    assigned: assignedDeliveries.length,
    inProgress: assignedDeliveries.filter(d => ['PICKED_UP', 'IN_TRANSIT'].includes(d.status)).length,
    completed: assignedDeliveries.filter(d => d.status === 'DELIVERED').length,
    totalEarnings: assignedDeliveries
      .filter(d => d.status === 'DELIVERED')
      .reduce((total, delivery) => total + calculateEstimatedEarnings(delivery.weightKg || 0), 0),
    pendingPayments: Object.values(paymentStatuses).filter(status => status === 'AWAITING_CASH_PAYMENT').length
  };

  // ===== CUSTOMER RATING COMPONENT =====
  
  // ===== LOADING STATE =====
  
  if (loading) {
    return (
      <div style={styles.loading}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '16px', color: '#718096' }}>Loading transporter dashboard...</p>
      </div>
    );
  }
  // ===== MAIN RENDER (JSX) =====
  return (
    <div style={styles.container}>
      {/* ===== HEADER SECTION ===== */}
      <TransporterProfileHeader
        title={`Welcome back, ${user?.fullName || 'Transporter'}! 🚚`}
        subtitle="Manage your deliveries and earn money"
        isAvailable={isAvailable}
        onAvailabilityChange={updateAvailabilityStatus}
        loadingAvailability={loadingAvailability}
        onRefresh={refreshData}
      />

      {/* ===== MAIN CONTENT SECTION ===== */}

      <div style={styles.mainContent}>
        {/* ===== STATS CARDS ===== */}
        {/* NEW: Stats Cards using StatCard component */}
      <div style={{
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        marginBottom: '32px'
      }}>
        <StatCard
          icon={Package}
          color="#3182ce"
          label="Available Jobs"
          value={stats.available}
        />
        <StatCard
          icon={Truck}
          color="#38a169"
          label="My Deliveries"
          value={stats.assigned}
        />
        <StatCard
          icon={Clock}
          color="#d69e2e"
          label="In Progress"
          value={stats.inProgress}
        />
        <StatCard
          icon={Euro}
          color="#38a169"
          label="Total Earnings"
          value={`€${stats.totalEarnings.toFixed(2)}`}
        />
      </div>

        {/* ===== TABS NAVIGATION ===== */}

        <TabNavigation
          tabs={[
            {
              key: 'available',
              label: 'Available Jobs',
              count: stats.available,
              icon: Package
            },
            {
              key: 'assigned', 
              label: 'My Deliveries',
              count: stats.assigned,
              icon: Truck
            },
            {
              key: 'pricing',
              label: 'Pricing Config',
              badge: pricingExists ? { text: '✓', color: '#38a169' } : { text: '⚠️', color: '#d69e2e' },
              icon: Euro
            },
            {
              key: 'routes',
              label: 'My Routes',
              count: routes.length,
              icon: Calendar
            }
          ]}
          activeTab={selectedTab}
          onTabChange={setSelectedTab}
          style="tabs"
        />
        

        {/* ===== TAB CONTENT SECTIONS ===== */}
        
        {/* AVAILABLE JOBS TAB */}
        
        {/* NEW: Available Jobs with DeliveryCard */}
        {selectedTab === 'available' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              <Package size={20} />
              Available Delivery Jobs
            </h3>
    
            {availableDeliveries.length > 0 ? (
              availableDeliveries.map(delivery => (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  userRole="TRANSPORTER"
                  onAction={(action, delivery, extra) => {
                    switch (action) {
                      case 'applyToJob':
                        applyToDelivery(delivery.id);
                        break;
                      case 'acceptJob':
                        acceptDelivery(delivery.id);
                        break;
                      case 'declineJob':
                        setSelectedDelivery(delivery);
                        setShowDeclineModal(true);
                        break;
                      case 'viewDetails':
                        setSelectedAvailableJob(delivery);
                        setShowAvailableJobDetails(true);
                        break;
                      default:
                        console.log('Unhandled action:', action);
                    }
                  }}
                  pricing={pricingExists ? calculateDisplayEarnings(delivery) : null}

                  // ⬅️ added: needed for hover card
                  onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                  hoveredCustomer={hoveredCustomer}
                  onCustomerHover={setHoveredCustomer}
                  customerRatingCard={
                    hoveredCustomer === delivery.id && delivery.customerId && (
                      <CustomerRatingCard
                        customerId={delivery.customerId}
                        customerEmail={delivery.customerEmail}
                        mousePosition={mousePosition}
                      />
                    )
                  }
                />
              ))
            ) : (
              <div style={styles.emptyState}>
                <Package style={styles.emptyIcon} />
                <h3>No available jobs</h3>
                <p>Check back later for new delivery opportunities!</p>
              </div>
            )}
          </div>
        )}


        {/* ROUTES TAB */}
        
      {selectedTab === 'routes' && ( <RouteManagement 
          onRoutesChange={(routesData) => setRoutes(routesData)} 
        />
      )}

        {/* ASSIGNED DELIVERIES TAB */}

  {/* NEW: Assigned Deliveries with DeliveryCard */}      
      {selectedTab === 'assigned' && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <Truck size={20} />
            My Assigned Deliveries
          </h3>
          
          {assignedDeliveries.length > 0 ? (
            assignedDeliveries.map(delivery => {
              const paymentStatus = paymentStatuses[delivery.id];
              const paymentStatusStyle = getPaymentStatusColor(paymentStatus);
              const timeLeft = delivery.status === 'REQUESTED' ? calculateTimeRemaining(delivery.requestedAt) : null;
              
              return (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  userRole="TRANSPORTER"
                  onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                  onAction={(action, delivery, extra) => {
                    switch (action) {
                      case 'acceptRequest':
                        acceptDeliveryRequest(delivery.id);
                        break;
                      case 'declineRequest':
                        setSelectedDelivery(delivery);
                        setShowDeclineModal(true);
                        break;
                      case 'updateStatus':
                        setSelectedDelivery(delivery);
                        setNewStatus(extra);
                        setShowStatusModal(true);
                        break;
                      case 'declineJob':
                        setSelectedDelivery(delivery);
                        setShowDeclineModal(true);
                        break;
                      case 'confirmCOD':
                        markCashPayment(delivery.id);
                        break;
                      case 'rateCustomer':
                        setSelectedRatingDelivery(delivery);
                        setShowRatingModal(true);
                        break;
                      case 'viewDetails':
                        setSelectedViewDelivery(delivery);
                        setShowViewDetailsModal(true);
                        break;
                      case 'openChat':
                        openChat(delivery);
                        break;
                      default:
                        console.log('Unhandled action:', action);
                    }
                  }}
                  pricing={pricingExists ? calculateDisplayEarnings(delivery) : null}
                  paymentStatus={paymentStatus}
                  paymentStatusStyle={paymentStatusStyle}
                  unreadCount={getUnreadCount(delivery.id)}
                  canRate={canRateDeliveries[delivery.id]}
                  timeRemaining={timeLeft}
                  hoveredCustomer={hoveredCustomer}
                  onCustomerHover={setHoveredCustomer}
                  customerRatingCard={hoveredCustomer === delivery.id && delivery.customerId && (
                    <CustomerRatingCard
                      customerId={delivery.customerId}
                      customerEmail={delivery.customerEmail}
                       mousePosition={mousePosition}
                    />
                  )}
                />
              );
            })
          ) : (
            <div style={styles.emptyState}>
              <Truck style={styles.emptyIcon} />
              <h3>No assigned deliveries</h3>
              <p>Accept some jobs from the "Available Jobs" tab to get started!</p>
            </div>
          )}
        </div>
      )}
        
        {/* PRICING TAB */}

        {selectedTab === 'pricing' && <PricingConfiguration />}

      </div>

      {/* ===== MODAL COMPONENTS ===== */}
      
      {/* Status Update Modal */}
      {/* Status Update Modal - NEW: Using shared StatusUpdateModal component */}

      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedDelivery(null);
          setNewStatus('');
        }}
        onConfirm={async (deliveryId, status) => {
          await apiClient.put(`/deliveries/${deliveryId}/status`, { status });
          await fetchAssignedDeliveries();
        }}
        delivery={selectedDelivery}
        newStatus={newStatus}
      />

      {/* Decline Modal */}
      {/* Decline Modal - NEW: Using shared DeclineModal component */}

      <DeclineModal
        isOpen={showDeclineModal}
        onClose={() => {
          setShowDeclineModal(false);
          setSelectedDelivery(null);
        }}
        onSubmit={async ({ deliveryId, reason, message }) => {
          await apiClient.post(`/deliveries/${deliveryId}/decline`, {
            reason: reason,
            customMessage: message
          });
          if (selectedTab === 'assigned') {
            await fetchAssignedDeliveries();
          } else {
            await fetchAvailableDeliveries();
          }
          
        }}
        delivery={selectedDelivery}
      />
      

      {/* View Details Modal */}
      {/* View Details Modal - NEW: Using shared ViewDetailsModal component */}

      <ViewDetailsModal
        isOpen={showViewDetailsModal}
        onClose={() => {
          setShowViewDetailsModal(false);
          setSelectedViewDelivery(null);
        }}
        delivery={selectedViewDelivery}
        userRole="TRANSPORTER"
      />


      {/* Available Job Details Modal */}
      
      {/* Available Job Details Modal */}
      <AvailableJobDetailsModal
        isOpen={showAvailableJobDetails}
        onClose={() => {
          setShowAvailableJobDetails(false);
          setSelectedAvailableJob(null);
        }}
        job={selectedAvailableJob}
        onApply={applyToDelivery}
        onAccept={acceptDelivery}
        calculateEarnings={calculateEstimatedEarnings}
        pricingExists={pricingExists}
      />

      {/* Rating Modal */}
      {/* Rating Modal - NEW: Using shared RatingModal component */}

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setSelectedRatingDelivery(null);
        }}
        onSubmit={async (ratingData) => {
          // Transporter rates customer
          const customerId = selectedRatingDelivery.customerId;
          
          await apiClient.post(`/deliveries/${ratingData.deliveryId}/rate`, {
            deliveryId: ratingData.deliveryId,
            reviewerId: null, // Backend will get from auth
            revieweeId: customerId,
            rating: ratingData.rating,
            feedback: ratingData.feedback
          });

          fetchAssignedDeliveries(); // Refresh to update UI
          alert('Rating submitted successfully!');
        }}
        delivery={selectedRatingDelivery}
        userRole="TRANSPORTER"
        targetUser={{
          name: selectedRatingDelivery?.customerEmail,
          email: selectedRatingDelivery?.customerEmail
        }}
      />

          <ChatSidebar
        isOpen={chatOpen}
        onClose={closeChat}
        delivery={selectedChatDelivery}
        //onNewMessage={handleNewMessage}
        onMessageRead={handleMessageRead}
      />
      
    </div>
  );
};

export default TransporterDashboard;