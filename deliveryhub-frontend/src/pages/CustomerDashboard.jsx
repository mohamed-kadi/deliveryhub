import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, Euro, MessageCircle, Plus, Search, Truck, CheckCircle, X, User } from 'lucide-react';
import apiClient from '../services/apiClient';
import ChatSidebar from '../components/ChatSidebar';
import { WithNotificationBadge } from '../components/NotificationBadge';
import useUnreadMessages from '../hooks/useUnreadMessages';
import ProfileHeader from '../components/ProfileHeader';
import FeaturedTransporters from '../components/FeaturedTransporters';
import { useAuth } from '../contexts/AuthContext';
// ADD THESE IMPORTS (RESTRUCTURING)
import StatCard from '../components/shared/StatCard';
import TabNavigation from '../components/shared/TabNavigation';
import DeliveryCard from '../components/shared/DeliveryCard';
import RatingModal from '../components/shared/RatingModal';
import CreateDeliveryModal from '../components/shared/CreateDeliveryModal';
import PaymentModal from '../components/shared/PaymentModal';
import PaymentDetailsModal from '../components/shared/PaymentDetailsModal';
import ApplicationsModal from '../components/shared/ApplicationsModal';
import CancelModal from '../components/shared/CancelModal';
import TransporterRatingCard from '../components/shared/TransporterRatingCard';
import useWebSocket from '../hooks/useWebSocket';

const CustomerDashboard = () => {
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [paymentSummaries, setPaymentSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatDelivery, setSelectedChatDelivery] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [availableTransporters, setAvailableTransporters] = useState([]);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [showApplications, setShowApplications] = useState(false);
  const [deliveryApplications, setDeliveryApplications] = useState([]);
  const [pendingDeliveryId, setPendingDeliveryId] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPaymentDelivery, setSelectedPaymentDelivery] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRatingDelivery, setSelectedRatingDelivery] = useState(null);
  const [canRateDeliveries, setCanRateDeliveries] = useState({});
  const [hoveredTransporter, setHoveredTransporter] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { getUnreadCount, markDeliveryAsRead, handleNewMessage, handleMessageRead } = useUnreadMessages();


  // 🔔 Global notifications for CustomerDashboard
  
 useWebSocket(
      null,
      null,
      (notification) => {
        if (notification.type === 'NEW_MESSAGE') {
          handleNewMessage({ matchId: notification.deliveryId });
        }
      }
    );

  const { user } = useAuth();



  // FIXED: Handle booking transporter from featured section
  // 🔄 WITH this simplified version:

  const handleBookTransporter = (transporter) => {
    console.log('🚀 Booking transporter:', transporter);
    setSelectedTransporter(transporter); // Store for pre-selection
    setShowCreateForm(true);
    fetchAvailableTransporters();
  };


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


  // Styles
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
    buttonSecondary: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    },
    buttonSuccess: {
      backgroundColor: '#38a169',
      color: 'white'
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
    grid3: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#4a5568'
    },
    input: {
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s'
    },
    textarea: {
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      transition: 'border-color 0.2s'
    },
    deliveryCard: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      transition: 'all 0.2s'
    },
    deliveryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    deliveryId: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c'
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    deliveryRoute: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px',
      fontSize: '14px',
      color: '#4a5568'
    },
    deliveryDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    },
    detailItem: {
      fontSize: '12px'
    },
    detailLabel: {
      color: '#718096',
      marginBottom: '2px'
    },
    detailValue: {
      color: '#1a202c',
      fontWeight: '500'
    },
    searchFilters: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap'
    },
    searchInput: {
      flex: 1,
      minWidth: '200px',
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px'
    },
    filterSelect: {
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      minWidth: '120px'
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
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1a202c'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#718096'
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
    transporterCard: {
      padding: '16px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    selectedTransporter: {
      padding: '12px',
      border: '2px solid #38a169',
      borderRadius: '8px',
      backgroundColor: '#f0fff4'
    }
  };

  const fetchMyDeliveries = async () => {
    try {
      const response = await apiClient.get('/deliveries/my');
      const data = response.data;
      setMyDeliveries(data);
      // Fetch payment summaries and statuses
      const summaries = {};
      const statuses = {};
      for (const delivery of data) {
        if (delivery.id) {
          try {
            const paymentResponse = await apiClient.get(`/payment/${delivery.id}/summary`);
            summaries[delivery.id] = paymentResponse.data;
            const statusResponse = await apiClient.get(`/payment/${delivery.id}/status`);
        
            statuses[delivery.id] = statusResponse.data.replace(/"/g, '');
            
          } catch (error) {
            console.log(`Payment info not available for delivery ${delivery.id}`);
          }
        }
      }
      setPaymentSummaries(summaries);
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
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTransporters = async () => {
    try {
      const response = await apiClient.get('/marketplace/transporters');
      setAvailableTransporters(response.data);
      
    } catch (error) {
      console.error('Error fetching transporters:', error);
    }
  };


  const initiatePayment = async (deliveryId, paymentMethod) => {
    try {
      await apiClient.post(`/payment/${deliveryId}/initiate?method=${paymentMethod}`);
      setShowPaymentModal(false);
      fetchMyDeliveries();
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  const confirmPayment = async (deliveryId) => {
    try {
      await apiClient.post(`/payment/${deliveryId}/confirm`);
      fetchMyDeliveries();
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };


  useEffect(() => {
    fetchMyDeliveries();
  }, []);

  const dismissDeclinedDelivery = async (deliveryId) => {
    try {
      await apiClient.put(`/deliveries/${deliveryId}/dismiss-decline`);
      fetchMyDeliveries(); // Refresh the list
    } catch (error) {
      console.error('Error dismissing decline:', error);
    }
  };
  

  const fetchDeliveryApplications = async (deliveryId) => {
    try {
      const response = await apiClient.get(`/deliveries/${deliveryId}/applications`);
      
      const applications = response.data;
      setDeliveryApplications(applications);
      setPendingDeliveryId(deliveryId);
      setShowApplications(true);
      
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const acceptApplication = async (applicationId) => {
    try {
      const response = await apiClient.post(`/deliveries/applications/${applicationId}/accept`);
      const delivery = response.data;
      
      // Auto-initiate payment with default method (customer can change later)
      try {
        await apiClient.post(`/payment/${delivery.id}/initiate?method=COD`);
      } catch (paymentError) {
        console.error('Error initiating payment:', paymentError);
      }
      setShowApplications(false);
      setDeliveryApplications([]);
      setPendingDeliveryId(null);
      fetchMyDeliveries();
      alert('Transporter selected successfully!');
      
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  const checkCanRate = async (deliveryId) => {
    try {
      const response = await apiClient.get(`/deliveries/${deliveryId}/can-rate`);
      return response.data;
    } catch (error) {
      console.error('Error checking rating permission:', error);
      return false;
    }
  };
  

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': { bg: '#fef5e7', text: '#744210', border: '#f6e05e' },
      'ASSIGNED': { bg: '#ebf8ff', text: '#2a4a6b', border: '#90cdf4' },
      'PICKED_UP': { bg: '#f0fff4', text: '#22543d', border: '#9ae6b4' },
      'IN_TRANSIT': { bg: '#e6fffa', text: '#234e52', border: '#81e6d9' },
      'DELIVERED': { bg: '#f0fff4', text: '#22543d', border: '#68d391' },
      'DECLINED': { bg: '#fed7d7', text: '#742a2a', border: '#fc8181' },
      'CANCELLED': { bg: '#fed7d7', text: '#742a2a', border: '#fc8181' }
    };
    return colors[status] || colors['PENDING'];
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'PENDING': { bg: '#fef5e7', text: '#744210', border: '#f6e05e' },
      'AWAITING_CASH_PAYMENT': { bg: '#ebf8ff', text: '#2a4a6b', border: '#90cdf4' },
      'PAID': { bg: '#f0fff4', text: '#22543d', border: '#68d391' },
      'FAILED': { bg: '#fed7d7', text: '#742a2a', border: '#fc8181' }
    };
    return colors[status] || colors['PENDING'];
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'PAID': return <CheckCircle size={14} />;
      case 'FAILED': return <X size={14} />;
      case 'AWAITING_CASH_PAYMENT': return <Clock size={14} />;
      default: return <Euro size={14} />;
    }
  };

  const getPaymentStatusDisplayName = (status) => {
    switch (status) {
      case 'AWAITING_CASH_PAYMENT': return 'Awaiting COD';
      case 'PENDING': return 'Payment Due';
      case 'PAID': return 'Paid';
      case 'FAILED': return 'Failed';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle size={16} />;
      case 'CANCELLED': return <X size={16} />;
      case 'IN_TRANSIT': case 'PICKED_UP': return <Truck size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredDeliveries = myDeliveries.filter(delivery => {
    const matchesStatus = !statusFilter || delivery.status === statusFilter;
    const matchesSearch = !searchTerm ||
      delivery.pickupCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.dropoffCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.itemType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const deliveryStats = {
    total: myDeliveries.length,
    pending: myDeliveries.filter(d => d.status === 'PENDING').length,
    inTransit: myDeliveries.filter(d => ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(d.status)).length,
    delivered: myDeliveries.filter(d => d.status === 'DELIVERED').length
  };

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
        <p style={{ marginTop: '16px', color: '#718096' }}>Loading your deliveries...</p>
      </div>
    );
  }

  // COMPLETE CustomerDashboard Return Statement with UI Fixes

  return (
    <div style={styles.container}>
      {/* 🔥 FIXED: Personalized header with user name */}
      <ProfileHeader title={`Welcome back, ${user?.fullName || 'Customer'}! 👋`} />
    
      <div style={{
        padding: '24px',
        backgroundColor: '#f9fafb',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Featured Transporters Section */}
        <FeaturedTransporters onBookTransporter={handleBookTransporter} />
      
        {/* 🔥 FIXED: Clean section header instead of redundant "My Dashboard" */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Your Deliveries
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>
              Track and manage your shipments
            </p>
          </div>
          <button
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onClick={() => {
              setShowCreateForm(true);
              fetchAvailableTransporters();
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
          >
            <Plus size={16} />
            New Delivery
          </button>
        </div>

        {/* Stats Cards */}
        {/* NEW: Stats Cards using StatCard component */}
        <div style={{
          display: 'grid',
          gap: '24px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          marginBottom: '32px'
        }}>
          <StatCard
            icon={Package}
            color="#3182ce"
            label="Total Deliveries"
            value={deliveryStats.total}
          />
          <StatCard
            icon={Clock}
            color="#d69e2e"
            label="In Transit"
            value={deliveryStats.inTransit}
          />
          <StatCard
            icon={CheckCircle}
            color="#38a169"
            label="Delivered"
            value={deliveryStats.delivered}
          />
        </div>

        {/* Search and Filters */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <Package size={20} />
            My Deliveries
          </h3>

          {/* NEW: Search input + TabNavigation for status filters */}
          <div style={{marginBottom: '24px'}}>
            {/* Search Input */}
            <div style={{position: 'relative', marginBottom: '16px', maxWidth: '400px'}}>
              <Search style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096'}} size={16} />
              <input
                type="text"
                placeholder="Search by city or item type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            {/* Status Filter Tabs */}
            <TabNavigation
              tabs={[
                { 
                  key: '', 
                  label: 'All Deliveries', 
                  count: myDeliveries.length 
                },
                { 
                  key: 'PENDING', 
                  label: 'Pending', 
                  count: myDeliveries.filter(d => d.status === 'PENDING').length 
                },
                { 
                  key: 'ASSIGNED', 
                  label: 'Assigned', 
                  count: myDeliveries.filter(d => d.status === 'ASSIGNED').length 
                },
                { 
                  key: 'IN_TRANSIT', 
                  label: 'In Transit', 
                  count: myDeliveries.filter(d => ['PICKED_UP', 'IN_TRANSIT'].includes(d.status)).length 
                },
                { 
                  key: 'DELIVERED', 
                  label: 'Delivered', 
                  count: myDeliveries.filter(d => d.status === 'DELIVERED').length 
                }
              ]}
              activeTab={statusFilter}
              onTabChange={setStatusFilter}
              style="pills"
            />
          </div>

          {/* Deliveries List */}

          {/* NEW: Universal DeliveryCard components */}
          
          {filteredDeliveries.length > 0 ? (
            filteredDeliveries.map(delivery => {
              const payment = paymentSummaries[delivery.id];
              const paymentStatus = paymentStatuses[delivery.id];
              const paymentStatusStyle = getPaymentStatusColor(paymentStatus);
              
              return (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  userRole="CUSTOMER"
                  onAction={(action, delivery, extra) => {
                    switch (action) {
                      case 'viewApplications':
                        fetchDeliveryApplications(delivery.id);
                        break;
                      case 'rateTransporter':
                        setSelectedRatingDelivery(delivery);
                        setShowRatingModal(true);
                        break;
                      case 'cancelDelivery':
                        setSelectedDelivery(delivery);
                        setShowCancelModal(true);
                        break;
                      case 'showPayment':
                        setSelectedDelivery(delivery);
                        setShowPaymentModal(true);
                        break;
                      case 'paymentDetails':
                        setSelectedPaymentDelivery({ ...delivery, payment });
                        setShowPaymentDetails(true);
                        break;
                      case 'dismissDecline':
                        dismissDeclinedDelivery(delivery.id);
                        break;
                      case 'openChat':
                        openChat(delivery);
                        break;
                      default:
                        console.log('Unhandled action:', action);
                    }
                  }}
                  pricing={payment?.calculatedAmount}
                  paymentStatus={paymentStatus}
                  paymentStatusStyle={paymentStatusStyle}
                  unreadCount={getUnreadCount(delivery.id)}
                  canRate={canRateDeliveries[delivery.id]}
                  onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                  hoveredTransporter={hoveredTransporter}
                  onTransporterHover={setHoveredTransporter}
                  transporterRatingCard={hoveredTransporter === delivery.id && delivery.transporterId && (
                    <TransporterRatingCard
                      transporterId={delivery.transporterId}
                      transporterEmail={delivery.transportEmail}
                      mousePosition={mousePosition}
                    />
                  )}
                />
              );
            })
          ) : (
            <div style={styles.emptyState}>
              <Package style={styles.emptyIcon} />
              <h3>No deliveries found</h3>
              <p>
                {myDeliveries.length === 0 
                  ? "You haven't created any deliveries yet. Click 'New Delivery' to get started!"
                  : "No deliveries match your search criteria."
                }
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Create Delivery Modal with Marketplace */}

      {/* Create Delivery Modal - NEW: Using shared CreateDeliveryModal component */}

      <CreateDeliveryModal
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setSelectedTransporter(null); // Clear pre-selection
        }}
        onSubmit={async (submissionData) => {
          try {
            const response = await apiClient.post('/deliveries', submissionData);
            const delivery = response.data;
            
            // Auto-initiate payment for direct assignment
            if (submissionData.assignmentMethod === 'direct') {
              try {
                await apiClient.post(`/payment/${delivery.id}/initiate?method=COD`);
              } catch (paymentError) {
                console.error('Error initiating payment:', paymentError);
              }
            }
            
            fetchMyDeliveries();
            
            if (submissionData.assignmentMethod === 'marketplace') {
              alert(`Delivery posted to marketplace! ID: ${delivery.id}`);
            }
          } catch (error) {
            console.error('Error creating delivery:', error);
            throw error; // Re-throw so modal can handle it
          }
        }}
        preSelectedTransporter={selectedTransporter}
        availableTransporters={availableTransporters}
        onTransporterSelect={(transporter) => {
          // Handle transporter selection if needed
          console.log('Transporter selected:', transporter);
        }}
      />


       {/* Payment Modal, Cancel Modal, Applications Modal, Payment Details Modal, Rating Modal */}
    
      {/* Payment Modal */}
      {/* Payment Modal - NEW: Using shared PaymentModal component */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={async (deliveryId, paymentMethod) => {
          await apiClient.post(`/payment/${deliveryId}/initiate?method=${paymentMethod}`);
          fetchMyDeliveries();
        }}
        delivery={selectedDelivery}
        paymentSummary={selectedDelivery ? paymentSummaries[selectedDelivery.id] : null}
      />

      {/* Cancel Modal */}
      {/* Cancel Modal - NEW: Using shared CancelModal component */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedDelivery(null);
        }}
        onSubmit={async (deliveryId, reason) => {
          await apiClient.post(`/deliveries/${deliveryId}/cancel`, {
            deliveryId: deliveryId,
            cancelReason: reason
          });
          fetchMyDeliveries();
        }}
        delivery={selectedDelivery}
      />

      {/* Applications Modal */}
      {/* Applications Modal - NEW: Using shared ApplicationsModal component */}

      <ApplicationsModal
        isOpen={showApplications}
        onClose={() => setShowApplications(false)}
        onAcceptApplication={acceptApplication}
        applications={deliveryApplications}
        deliveryId={pendingDeliveryId}
      />

      {/* Payment Details Modal */}
      {/* Payment Details Modal - NEW: Using shared PaymentDetailsModal component */}

      <PaymentDetailsModal
        isOpen={showPaymentDetails}
        onClose={() => setShowPaymentDetails(false)}
        delivery={selectedPaymentDelivery}
        onPayNow={(delivery) => {
          setSelectedDelivery(delivery);
          setShowPaymentModal(true);
        }}
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
          // Customer rates transporter
          const revieweeId = selectedRatingDelivery.transporterId;
          
          await apiClient.post(`/deliveries/${ratingData.deliveryId}/rate`, {
            deliveryId: ratingData.deliveryId,
            reviewerId: null, // Backend will get from auth
            revieweeId: revieweeId,
            rating: ratingData.rating,
            feedback: ratingData.feedback
          });

          fetchMyDeliveries(); // Refresh to update UI
          alert('Rating submitted successfully!');
        }}
        delivery={selectedRatingDelivery}
        userRole="CUSTOMER"
        targetUser={{
          name: selectedRatingDelivery?.transportEmail,
          email: selectedRatingDelivery?.transportEmail
        }}
      />

      {/* ChatSidebar */}

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

export default CustomerDashboard;