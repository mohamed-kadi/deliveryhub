// src/components/shared/PaymentDetailsModal.jsx
import React from 'react';
import { X, CheckCircle, Clock, Euro } from 'lucide-react';

const PaymentDetailsModal = ({
  isOpen,
  onClose,
  delivery,
  onPayNow = null // Optional - for pending payments
}) => {

  if (!isOpen || !delivery) return null;

  const { payment } = delivery;

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
    deliveryInfo: {
      marginBottom: '20px'
    },
    deliveryTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '8px'
    },
    deliveryDetail: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '4px'
    },
    section: {
      backgroundColor: '#f7fafc',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '12px'
    },
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px'
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column'
    },
    detailLabel: {
      fontSize: '12px',
      color: '#718096',
      marginBottom: '2px'
    },
    detailValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1a202c'
    },
    pricingSection: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px'
    },
    pricingRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    pricingLabel: {
      color: '#718096'
    },
    pricingValue: {
      fontWeight: '500'
    },
    pricingDivider: {
      margin: '12px 0',
      border: 'none',
      borderTop: '1px solid #e2e8f0'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    totalLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c'
    },
    totalValue: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#38a169'
    },
    statusSection: {
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px'
    },
    statusHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    statusLabel: {
      fontWeight: '600'
    },
    statusFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    statusMethod: {
      fontSize: '14px'
    },
    buttonContainer: {
      textAlign: 'center'
    },
    button: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    buttonPrimary: {
      backgroundColor: '#3182ce',
      color: 'white'
    },
    buttonSecondary: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    }
  };

  return (
    <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modalContent}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Payment Details</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Delivery Information */}
        <div style={styles.deliveryInfo}>
          <h4 style={styles.deliveryTitle}>Delivery #{delivery.id}</h4>
          <p style={styles.deliveryDetail}>
            📍 {delivery.pickupCity} → {delivery.dropoffCity}
          </p>
          <p style={styles.deliveryDetail}>
            📦 {delivery.itemType} • 📅 {delivery.pickupDate}
          </p>
        </div>

        {/* Transporter Details */}
        {payment && (
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Transporter Details</h4>
            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Transporter:</span>
                <div style={styles.detailValue}>
                  {payment.transporterName}
                </div>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Contact:</span>
                <div style={styles.detailValue}>
                  {delivery.transportEmail}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        {payment && (
          <div style={styles.pricingSection}>
            <h4 style={styles.sectionTitle}>Pricing Breakdown</h4>

            <div style={styles.pricingRow}>
              <span style={styles.pricingLabel}>Item Weight:</span>
              <span style={styles.pricingValue}>{payment.weightKg} kg</span>
            </div>

            <div style={styles.pricingRow}>
              <span style={styles.pricingLabel}>Rate Structure:</span>
              <span style={{ fontSize: '12px', color: '#4a5568' }}>
                {payment.weightKg <= payment.threshold
                  ? `Fixed rate (≤${payment.threshold}kg)`
                  : `€${payment.ratePerKg}/kg (>${payment.threshold}kg)`
                }
              </span>
            </div>

            <div style={styles.pricingRow}>
              <span style={styles.pricingLabel}>Applied Rate:</span>
              <span style={styles.pricingValue}>
                {payment.weightKg <= payment.threshold
                  ? `€${payment.fixedPriceUnderThreshold}`
                  : `${payment.weightKg} kg × €${payment.ratePerKg}`
                }
              </span>
            </div>

            <hr style={styles.pricingDivider} />

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total Amount:</span>
              <span style={styles.totalValue}>
                €{payment.calculatedAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Payment Status */}
        {payment && (
          <div
            style={{
              ...styles.statusSection,
              backgroundColor: getPaymentStatusColor(payment.paymentStatus).bg,
              border: `1px solid ${getPaymentStatusColor(payment.paymentStatus).border}`
            }}
          >
            <div style={styles.statusHeader}>
              {getPaymentStatusIcon(payment.paymentStatus)}
              <span
                style={{
                  ...styles.statusLabel,
                  color: getPaymentStatusColor(payment.paymentStatus).text
                }}
              >
                Payment Status: {getPaymentStatusDisplayName(payment.paymentStatus)}
              </span>
            </div>

            <div style={styles.statusFooter}>
              <span
                style={{
                  ...styles.statusMethod,
                  color: getPaymentStatusColor(payment.paymentStatus).text
                }}
              >
                Method: {payment.paymentMethod}
              </span>

              {payment.paymentStatus === 'PENDING' && onPayNow && (
                <button
                  style={{ ...styles.button, ...styles.buttonPrimary }}
                  onClick={() => {
                    onClose();
                    onPayNow(delivery);
                  }}
                >
                  <Euro size={16} />
                  Pay Now
                </button>
              )}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
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

export default PaymentDetailsModal;