// src/components/shared/DeclineModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const DeclineModal = ({
  isOpen,
  onClose,
  onSubmit,
  delivery,
  title = "Decline Delivery Request",
  reasonLabel = "Reason for declining",
  reasonPlaceholder = "Select a reason...",
  messageLabel = "Additional message (optional)",
  messagePlaceholder = "Provide additional details to help the customer...",
  submitButtonText = "Decline Request",
  cancelButtonText = "Cancel",
  reasons = [
    { value: "FULL_CAPACITY", label: "Vehicle at full capacity" },
    { value: "TIME_CONFLICT", label: "Schedule conflict" },
    { value: "ROUTE_MISMATCH", label: "Route doesn't match my travel plans" },
    { value: "DISTANCE_TOO_FAR", label: "Pickup/delivery location too far" },
    { value: "OTHER", label: "Other reason" }
  ]
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!selectedReason.trim()) {
      alert('Please select a reason for declining');
      return;
    }

    try {
      await onSubmit({
        deliveryId: delivery.id,
        reason: selectedReason,
        message: customMessage.trim()
      });
      handleClose();
    } catch (error) {
      console.error('Error declining delivery:', error);
        const msg = error.response?.data?.message || error.response?.data || error.message;
        alert(`Decline failed: ${msg}`);
      // Error handling can be done by parent component
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomMessage('');
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
      marginBottom: '16px'
    },
    deliveryTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '4px'
    },
    deliveryDetail: {
      fontSize: '14px',
      color: '#718096'
    },
    formSection: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#4a5568'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      transition: 'border-color 0.2s'
    },
    buttonContainer: {
      display: 'flex',
      gap: '8px',
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px'
    },
    buttonDanger: {
      backgroundColor: '#e53e3e',
      color: 'white',
      flex: 1
    },
    buttonDangerDisabled: {
      backgroundColor: '#fed7d7',
      color: '#742a2a',
      cursor: 'not-allowed',
      opacity: 0.6
    },
    buttonSecondary: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    }
  };
  return (
    <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={styles.modalContent}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{title}</h2>
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
        </div>

        {/* Reason Selection */}
        <div style={styles.formSection}>
          <label style={styles.label}>
            {reasonLabel} *
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            style={styles.select}
            onFocus={(e) => e.target.style.borderColor = '#3182ce'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="">{reasonPlaceholder}</option>
            {reasons.map(reason => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Message */}
        <div style={styles.formSection}>
          <label style={styles.label}>
            {messageLabel}
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={messagePlaceholder}
            style={styles.textarea}
            onFocus={(e) => e.target.style.borderColor = '#3182ce'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button
            style={{
              ...styles.button,
              ...(selectedReason ? styles.buttonDanger : { ...styles.buttonDanger, ...styles.buttonDangerDisabled })
            }}
            onClick={handleSubmit}
            disabled={!selectedReason}
            onMouseOver={(e) => {
              if (selectedReason) {
                e.target.style.backgroundColor = '#c53030';
              }
            }}
            onMouseOut={(e) => {
              if (selectedReason) {
                e.target.style.backgroundColor = '#e53e3e';
              }
            }}
          >
            <X size={16} />
            {submitButtonText}
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={handleClose}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && handleClose()}>
  //     <div style={styles.modalContent}>
  //       {/* Header */}
  //       <div style={styles.modalHeader}>
  //         <h2 style={styles.modalTitle}>{title}</h2>
  //         <button style={styles.closeButton} onClick={handleClose}>
  //           <X size={20} />
  //         </button>
  //       </div>

  //       {/* Delivery Information */}
  //       <div style={styles.deliveryInfo}>
  //         <h4 style={styles.deliveryTitle}>Delivery #{delivery.id}</h4>
  //         <p style={styles.deliveryDetail}>
  //           {delivery.pickupCity} → {delivery.dropoffCity}
  //         </p>
  //       </div>

  //       {/* Reason Selection */}
  //       <div style={styles.formSection}>
  //         <label style={styles.label}>
  //           {reasonLabel} *
  //         </label>
  //         <select
  //           value={selectedReason}
  //           onChange={(e) => setSelectedReason(e.target.value)}
  //           style={styles.select}
  //           onFocus={(e) => e.target.style.borderColor = '#3182ce'}
  //           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
  //         >
  //           <option value="">{reasonPlaceholder}</option>
  //           {reasons.map(reason => (
  //             <option key={reason.value} value={reason.value}>
  //               {reason.label}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       {/* Additional Message */}
  //       <div style={styles.formSection}>
  //         <label style={styles.label}>
  //           {messageLabel}
  //         </label>
  //         <textarea
  //           value={customMessage}
  //           onChange={(e) => setCustomMessage(e.target.value)}
  //           placeholder={messagePlaceholder}
  //           style={styles.textarea}
  //           onFocus={(e) => e.target.style.borderColor = '#3182ce'}
  //           onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
  //         />
  //       </div>

  //       {/* Action Buttons */}
  //       <div style={styles.buttonContainer}>
  //         <button
  //           style={{
  //             ...styles.button,
  //             ...(selectedReason ? styles.buttonDanger : { ...styles.buttonDanger, ...styles.buttonDangerDisabled })
  //           }}
  //           onClick={handleSubmit}
  //           disabled={!selectedReason}
  //           onMouseOver={(e) => {
  //             if (selectedReason) {
  //               e.target.style.backgroundColor = '#c53030';
  //             }
  //           }}
  //           onMouseOut={(e) => {
  //             if (selectedReason) {
  //               e.target.style.backgroundColor = '#e53e3e';
  //             }
  //           }}
  //         >
  //           <X size={16} />
  //           {submitButtonText}
  //         </button>
  //         <button
  //           style={{ ...styles.button, ...styles.buttonSecondary }}
  //           onClick={handleClose}
  //           onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
  //           onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
  //         >
  //           {cancelButtonText}
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default DeclineModal;