// src/components/shared/StatusUpdateModal.jsx
import React from 'react';

const StatusUpdateModal = ({
  isOpen,
  onClose,
  onConfirm,
  delivery,
  newStatus
}) => {

  const handleConfirm = async () => {
    try {
      await onConfirm(delivery.id, newStatus);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      // Error handling can be done by parent component
    }
  };

  if (!isOpen || !delivery || !newStatus) return null;

  const formatStatusText = (status) => {
    return status?.replace('_', ' ') || status;
  };

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
      maxWidth: '400px',
      width: '100%'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1a202c'
    },
    deliveryInfo: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '16px'
    },
    statusInfo: {
      marginBottom: '24px'
    },
    statusLabel: {
      fontWeight: '500',
      marginBottom: '8px',
      color: '#1a202c'
    },
    statusValue: {
      fontWeight: '600',
      color: '#3182ce'
    },
    statusDescription: {
      fontSize: '14px',
      color: '#718096',
      marginTop: '4px'
    },
    buttonContainer: {
      display: 'flex',
      gap: '8px'
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
      justifyContent: 'center',
      gap: '6px'
    },
    buttonPrimary: {
      backgroundColor: '#3182ce',
      color: 'white',
      flex: 1
    },
    buttonSecondary: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    }
  };

  return (
    <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modalContent}>
        <h3 style={styles.modalTitle}>Update Delivery Status</h3>
        
        <p style={styles.deliveryInfo}>
          Delivery #{delivery.id} from {delivery.pickupCity} to {delivery.dropoffCity}
        </p>
        
        <div style={styles.statusInfo}>
          <p style={styles.statusLabel}>
            Change status to: <span style={styles.statusValue}>{formatStatusText(newStatus)}</span>
          </p>
          <p style={styles.statusDescription}>
            This will notify the customer about the delivery progress.
          </p>
        </div>

        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={handleConfirm}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
          >
            Confirm Update
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={onClose}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;