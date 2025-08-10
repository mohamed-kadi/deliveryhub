// src/components/shared/PaymentModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, Euro } from 'lucide-react';

const PaymentModal = ({
  isOpen,
  onClose,
  onSubmit,
  delivery,
  paymentSummary = null
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');

  const handleSubmit = async () => {
    try {
      await onSubmit(delivery.id, selectedPaymentMethod);
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
      // Error handling can be done by parent component
    }
  };

  const handleClose = () => {
    setSelectedPaymentMethod('COD'); // Reset to default
    onClose();
  };

  if (!isOpen || !delivery) return null;

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
      marginBottom: '24px'
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
    summaryCard: {
      backgroundColor: '#f7fafc',
      padding: '16px',
      borderRadius: '8px',
      marginTop: '12px'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: '600',
      borderTop: '1px solid #e2e8f0',
      paddingTop: '8px',
      marginTop: '8px'
    },
    paymentMethodsSection: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '16px'
    },
    paymentMethodsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    paymentOption: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    paymentOptionActive: {
      border: '2px solid #3182ce',
      backgroundColor: '#ebf8ff'
    },
    paymentOptionContent: {
      flex: 1
    },
    paymentOptionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '4px'
    },
    paymentOptionTitle: {
      fontWeight: '600',
      fontSize: '16px'
    },
    paymentOptionBadge: {
      fontSize: '12px',
      padding: '2px 8px',
      borderRadius: '12px',
      fontWeight: '500'
    },
    paymentOptionDescription: {
      fontSize: '13px',
      color: '#718096',
      marginLeft: '32px'
    },
    paymentOptionIcons: {
      display: 'flex',
      gap: '4px',
      marginTop: '8px',
      marginLeft: '32px'
    },
    radioInput: {
      marginRight: '16px'
    },
    checkIcon: {
      color: '#3182ce'
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px'
    },
    button: {
      padding: '14px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
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

  const paymentMethods = [
    {
      value: 'COD',
      icon: '💵',
      title: 'Cash on Delivery',
      badge: { text: 'Popular', color: '#f0fff4', textColor: '#22543d' },
      description: 'Pay with cash when your package arrives. No upfront payment required.'
    },
    {
      value: 'PAYPAL',
      icon: '🅿️',
      title: 'PayPal',
      badge: { text: 'Secure', color: '#ebf8ff', textColor: '#3182ce' },
      description: 'Pay securely with your PayPal account or linked cards.'
    },
    {
      value: 'STRIPE',
      icon: '💳',
      title: 'Credit/Debit Card',
      badge: { text: 'Instant', color: '#f0fff4', textColor: '#22543d' },
      description: 'Pay instantly with Visa, MasterCard, or American Express.',
      icons: ['💳', '🏧', '💰']
    }
  ];

  const getButtonText = () => {
    switch (selectedPaymentMethod) {
      case 'COD':
        return '💵 Confirm Cash on Delivery';
      case 'PAYPAL':
        return '🅿️ Pay with PayPal';
      case 'STRIPE':
        return '💳 Pay with Card';
      default:
        return 'Process Payment';
    }
  };

  return (
    <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={styles.modalContent}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Choose Payment Method</h2>
          <button style={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Delivery Information */}
        <div style={styles.deliveryInfo}>
          <h4 style={styles.deliveryTitle}>Delivery #{delivery.id}</h4>
          <p style={styles.deliveryDetail}>
            {delivery.pickupCity} → {delivery.dropoffCity}
          </p>

          {/* Payment Summary */}
          {paymentSummary && (
            <div style={styles.summaryCard}>
              <div style={styles.summaryRow}>
                <span>Transporter:</span>
                <span>{paymentSummary.transporterName}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Weight:</span>
                <span>{paymentSummary.weightKg}kg</span>
              </div>
              <div style={styles.summaryTotal}>
                <span>Total Amount:</span>
                <span>€{paymentSummary.calculatedAmount}</span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div style={styles.paymentMethodsSection}>
          <h4 style={styles.sectionTitle}>Choose Your Payment Method:</h4>

          <div style={styles.paymentMethodsList}>
            {paymentMethods.map(method => (
              <label
                key={method.value}
                style={{
                  ...styles.paymentOption,
                  ...(selectedPaymentMethod === method.value ? styles.paymentOptionActive : {})
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={selectedPaymentMethod === method.value}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  style={styles.radioInput}
                />
                
                <div style={styles.paymentOptionContent}>
                  <div style={styles.paymentOptionHeader}>
                    <span style={{ fontSize: '24px' }}>{method.icon}</span>
                    <span style={styles.paymentOptionTitle}>{method.title}</span>
                    <span
                      style={{
                        ...styles.paymentOptionBadge,
                        backgroundColor: method.badge.color,
                        color: method.badge.textColor
                      }}
                    >
                      {method.badge.text}
                    </span>
                  </div>
                  <div style={styles.paymentOptionDescription}>
                    {method.description}
                  </div>
                  {method.icons && (
                    <div style={styles.paymentOptionIcons}>
                      {method.icons.map((icon, index) => (
                        <span key={index} style={{ fontSize: '16px' }}>{icon}</span>
                      ))}
                    </div>
                  )}
                </div>

                {selectedPaymentMethod === method.value && (
                  <div style={styles.checkIcon}>
                    <CheckCircle size={20} />
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={handleSubmit}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
          >
            {getButtonText()}
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={handleClose}
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

export default PaymentModal;