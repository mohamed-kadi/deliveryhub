// src/components/shared/ViewDetailsModal.jsx
import React from 'react';
import { X, CheckCircle, Clock, Truck } from 'lucide-react';

const ViewDetailsModal = ({
  isOpen,
  onClose,
  delivery,
  userRole = 'TRANSPORTER' // 'CUSTOMER' | 'TRANSPORTER' | 'ADMIN'
}) => {

  if (!isOpen || !delivery) return null;

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': { bg: '#fef5e7', text: '#744210', border: '#f6e05e' },
      'REQUESTED': { bg: '#e6fffa', text: '#234e52', border: '#81e6d9' },
      'ASSIGNED': { bg: '#ebf8ff', text: '#2a4a6b', border: '#90cdf4' },
      'PICKED_UP': { bg: '#f0fff4', text: '#22543d', border: '#9ae6b4' },
      'IN_TRANSIT': { bg: '#e6fffa', text: '#234e52', border: '#81e6d9' },
      'DELIVERED': { bg: '#f0fff4', text: '#22543d', border: '#68d391' },
      'DECLINED': { bg: '#fed7d7', text: '#742a2a', border: '#fc8181' },
      'CANCELLED': { bg: '#fed7d7', text: '#742a2a', border: '#fc8181' }
    };
    return colors[status] || colors['PENDING'];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'REQUESTED': return <Clock size={16} />;
      case 'DELIVERED': return <CheckCircle size={16} />;
      case 'CANCELLED': case 'DECLINED': return <X size={16} />;
      case 'IN_TRANSIT': case 'PICKED_UP': return <Truck size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const statusStyle = getStatusColor(delivery.status);

  const styles = {
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
      color: '#1a202c',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#718096',
      padding: '4px'
    },
    deliveryHeader: {
      marginBottom: '20px'
    },
    deliveryTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '8px'
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    },
    detailsContainer: {
      display: 'grid',
      gap: '16px'
    },
    detailSection: {
      display: 'flex',
      flexDirection: 'column'
    },
    detailLabel: {
      fontSize: '12px',
      color: '#718096',
      fontWeight: '500',
      marginBottom: '4px'
    },
    detailValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c'
    },
    routeSection: {
      backgroundColor: '#f7fafc',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    routeTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '8px'
    },
    routeText: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c'
    },
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px'
    },
    descriptionSection: {
      marginBottom: '16px'
    },
    descriptionText: {
      fontSize: '14px',
      color: '#1a202c',
      fontWeight: '500',
      marginTop: '4px',
      padding: '12px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    buttonContainer: {
      textAlign: 'center',
      marginTop: '24px'
    },
    button: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    }
  };

  const getUserSpecificInfo = () => {
    if (userRole === 'CUSTOMER') {
      return {
        userLabel: 'Transporter',
        userValue: delivery.transportEmail || 'Not assigned yet'
      };
    } else {
      return {
        userLabel: 'Customer',
        userValue: delivery.customerEmail || 'N/A'
      };
    }
  };

  const userInfo = getUserSpecificInfo();

  return (
    <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modalContent}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Delivery Details</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Delivery Header */}
        <div style={styles.deliveryHeader}>
          <h4 style={styles.deliveryTitle}>Delivery #{delivery.id}</h4>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
            border: `1px solid ${statusStyle.border}`
          }}>
            {getStatusIcon(delivery.status)}
            {delivery.status}
          </div>
        </div>

        {/* Route Information */}
        <div style={styles.routeSection}>
          <div style={styles.routeTitle}>Route</div>
          <div style={styles.routeText}>
            📍 {delivery.pickupCity} → {delivery.dropoffCity}
          </div>
        </div>

        {/* Details Grid */}
        <div style={styles.detailGrid}>
          <div style={styles.detailSection}>
            <span style={styles.detailLabel}>{userInfo.userLabel}</span>
            <div style={styles.detailValue}>
              {userInfo.userValue}
            </div>
          </div>
          
          <div style={styles.detailSection}>
            <span style={styles.detailLabel}>Pickup Date</span>
            <div style={styles.detailValue}>
              {delivery.pickupDate}
            </div>
          </div>
        </div>

        <div style={styles.detailGrid}>
          <div style={styles.detailSection}>
            <span style={styles.detailLabel}>Item Type</span>
            <div style={styles.detailValue}>
              {delivery.itemType}
            </div>
          </div>
          
          <div style={styles.detailSection}>
            <span style={styles.detailLabel}>Weight</span>
            <div style={styles.detailValue}>
              {delivery.weightKg ? `${delivery.weightKg} kg` : 'Not specified'}
            </div>
          </div>
        </div>

        {/* Description */}
        {delivery.description && (
          <div style={styles.descriptionSection}>
            <span style={styles.detailLabel}>Description</span>
            <div style={styles.descriptionText}>
              {delivery.description}
            </div>
          </div>
        )}

        {/* Pickup/Dropoff Addresses if available */}
        {(delivery.pickupAddress || delivery.dropoffAddress) && (
          <div style={styles.detailGrid}>
            {delivery.pickupAddress && (
              <div style={styles.detailSection}>
                <span style={styles.detailLabel}>Pickup Address</span>
                <div style={styles.detailValue}>
                  {delivery.pickupAddress}
                </div>
              </div>
            )}
            
            {delivery.dropoffAddress && (
              <div style={styles.detailSection}>
                <span style={styles.detailLabel}>Dropoff Address</span>
                <div style={styles.detailValue}>
                  {delivery.dropoffAddress}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Special Instructions if available */}
        {delivery.specialInstructions && (
          <div style={styles.descriptionSection}>
            <span style={styles.detailLabel}>Special Instructions</span>
            <div style={styles.descriptionText}>
              {delivery.specialInstructions}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={onClose}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;