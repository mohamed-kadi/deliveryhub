// src/components/shared/RatingModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const RatingModal = ({
  isOpen,
  onClose,
  onSubmit,
  delivery,
  userRole, // 'CUSTOMER' | 'TRANSPORTER'
  targetUser // { name, email } - the person being rated
}) => {
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState('');

  const handleSubmit = async () => {
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert('Please select a rating from 1 to 5 stars');
      return;
    }

    try {
      await onSubmit({
        deliveryId: delivery.id,
        rating: ratingValue,
        feedback: ratingFeedback
      });
      
      // Reset form
      setRatingValue(0);
      setRatingFeedback('');
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      const errorMessage = error.response?.data || error.message || 'Failed to submit rating';
      alert(errorMessage);
    }
  };

  const handleClose = () => {
    setRatingValue(0);
    setRatingFeedback('');
    onClose();
  };

  if (!isOpen) return null;

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
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
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
    ratingSection: {
      marginBottom: '20px'
    },
    ratingLabel: {
      display: 'block',
      marginBottom: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c'
    },
    starsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '16px'
    },
    starButton: {
      background: 'none',
      border: 'none',
      fontSize: '32px',
      cursor: 'pointer',
      padding: '4px',
      transition: 'color 0.2s',
      borderRadius: '4px'
    },
    ratingText: {
      textAlign: 'center',
      marginBottom: '16px'
    },
    ratingTextSpan: {
      fontSize: '14px',
      color: '#718096'
    },
    feedbackSection: {
      marginBottom: '24px'
    },
    feedbackLabel: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#4a5568'
    },
    feedbackTextarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    buttonContainer: {
      display: 'flex',
      gap: '8px'
    },
    submitButton: {
      flex: 1,
      padding: '12px 16px',
      backgroundColor: '#d69e2e',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px'
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    cancelButton: {
      padding: '12px 16px',
      backgroundColor: '#e2e8f0',
      color: '#4a5568',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 0: return 'Click stars to rate';
      case 1: return '1 Star - Poor';
      case 2: return '2 Stars - Fair';
      case 3: return '3 Stars - Good';
      case 4: return '4 Stars - Very Good';
      case 5: return '5 Stars - Excellent';
      default: return '';
    }
  };

  const getModalTitle = () => {
    if (userRole === 'CUSTOMER') {
      return 'Rate Your Transporter';
    } else if (userRole === 'TRANSPORTER') {
      return 'Rate Your Customer';
    }
    return 'Submit Rating';
  };

  const getExperienceQuestion = () => {
    if (userRole === 'CUSTOMER') {
      return 'How was your delivery experience?';
    } else if (userRole === 'TRANSPORTER') {
      return 'How was your customer experience?';
    }
    return 'How was your experience?';
  };

  const getFeedbackPlaceholder = () => {
    if (userRole === 'CUSTOMER') {
      return 'Share details about your delivery experience...';
    } else if (userRole === 'TRANSPORTER') {
      return 'Share details about working with this customer...';
    }
    return 'Share details about your experience...';
  };

  const getTargetUserInfo = () => {
    if (userRole === 'CUSTOMER') {
      return {
        icon: '🚚',
        label: 'Transporter',
        name: targetUser?.name || delivery?.transportEmail || 'Transporter'
      };
    } else if (userRole === 'TRANSPORTER') {
      return {
        icon: '👤',
        label: 'Customer',
        name: targetUser?.name || delivery?.customerEmail || 'Customer'
      };
    }
    return {
      icon: '👤',
      label: 'User',
      name: targetUser?.name || 'User'
    };
  };

  const targetInfo = getTargetUserInfo();

  return (
    <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{getModalTitle()}</h2>
          <button style={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Delivery Information */}
        <div style={styles.deliveryInfo}>
          <h4 style={styles.deliveryTitle}>Delivery #{delivery?.id}</h4>
          <p style={styles.deliveryDetail}>
            📍 {delivery?.pickupCity} → {delivery?.dropoffCity}
          </p>
          <p style={styles.deliveryDetail}>
            {targetInfo.icon} {targetInfo.label}: {targetInfo.name}
          </p>
        </div>

        {/* Rating Section */}
        <div style={styles.ratingSection}>
          <label style={styles.ratingLabel}>
            {getExperienceQuestion()}
          </label>

          <div style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRatingValue(star)}
                style={{
                  ...styles.starButton,
                  color: star <= ratingValue ? '#d69e2e' : '#e2e8f0'
                }}
                onMouseEnter={(e) => e.target.style.color = '#d69e2e'}
                onMouseLeave={(e) => e.target.style.color = star <= ratingValue ? '#d69e2e' : '#e2e8f0'}
              >
                ⭐
              </button>
            ))}
          </div>

          <div style={styles.ratingText}>
            <span style={styles.ratingTextSpan}>
              {getRatingText(ratingValue)}
            </span>
          </div>
        </div>

        {/* Feedback Section */}
        <div style={styles.feedbackSection}>
          <label style={styles.feedbackLabel}>
            Additional feedback (optional)
          </label>
          <textarea
            value={ratingFeedback}
            onChange={(e) => setRatingFeedback(e.target.value)}
            placeholder={getFeedbackPlaceholder()}
            style={styles.feedbackTextarea}
          />
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button
            style={{
              ...styles.submitButton,
              ...(ratingValue === 0 ? styles.submitButtonDisabled : {})
            }}
            onClick={handleSubmit}
            disabled={ratingValue === 0}
            onMouseOver={(e) => {
              if (ratingValue > 0) {
                e.target.style.backgroundColor = '#b7791f';
              }
            }}
            onMouseOut={(e) => {
              if (ratingValue > 0) {
                e.target.style.backgroundColor = '#d69e2e';
              }
            }}
          >
            ⭐ Submit Rating
          </button>
          <button
            style={styles.cancelButton}
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

export default RatingModal;