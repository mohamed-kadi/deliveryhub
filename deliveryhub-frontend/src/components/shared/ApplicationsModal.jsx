// src/components/shared/ApplicationsModal.jsx
import React from 'react';
import { X, CheckCircle, User } from 'lucide-react';

const ApplicationsModal = ({
  isOpen,
  onClose,
  onAcceptApplication,
  applications = [],
  deliveryId = null
}) => {

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
      maxWidth: '600px',
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
    subtitle: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '16px'
    },
    applicationsList: {
      maxHeight: '400px',
      overflowY: 'auto'
    },
    applicationCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: 'white',
      transition: 'all 0.2s'
    },
    applicationHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    transporterInfo: {
      flex: 1
    },
    transporterName: {
      margin: '0 0 8px 0',
      fontSize: '16px',
      color: '#1a202c',
      fontWeight: '600'
    },
    ratingSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    rating: {
      fontSize: '14px',
      color: '#d69e2e'
    },
    ratingCount: {
      fontSize: '12px',
      color: '#718096'
    },
    deliveryCount: {
      fontSize: '12px',
      color: '#718096'
    },
    priceSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '8px'
    },
    priceInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    priceLabel: {
      fontSize: '12px',
      color: '#718096'
    },
    priceValue: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#38a169'
    },
    appliedInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    appliedLabel: {
      fontSize: '12px',
      color: '#718096'
    },
    appliedDate: {
      fontSize: '12px',
      color: '#4a5568'
    },
    contactInfo: {
      fontSize: '12px',
      color: '#718096'
    },
    selectButton: {
      padding: '8px 16px',
      backgroundColor: '#38a169',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginLeft: '16px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#718096'
    },
    emptyIcon: {
      margin: '0 auto 16px',
      display: 'block',
      color: '#cbd5e0'
    },
    emptyTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#4a5568'
    },
    emptyDescription: {
      fontSize: '14px'
    },
    tipSection: {
      marginTop: '20px',
      padding: '12px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px'
    },
    tipText: {
      fontSize: '12px',
      color: '#4a5568',
      margin: 0
    }
  };

  return (
    <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modalContent}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Transporter Applications</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Subtitle */}
        <div style={styles.subtitle}>
          {applications.length} transporter(s) applied for delivery #{deliveryId}
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div style={styles.applicationsList}>
            {applications.map(application => (
              <div
                key={application.id}
                style={styles.applicationCard}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={styles.applicationHeader}>
                  <div style={styles.transporterInfo}>
                    {/* Transporter Name */}
                    <h4 style={styles.transporterName}>
                      {application.transporterName}
                    </h4>

                    {/* Rating and Experience */}
                    <div style={styles.ratingSection}>
                      <span style={styles.rating}>
                        ⭐ {application.transporterRating.toFixed(1)}
                      </span>
                      <span style={styles.ratingCount}>
                        ({application.totalRatings} reviews)
                      </span>
                      <span style={styles.deliveryCount}>
                        • {application.completedDeliveries} deliveries
                      </span>
                    </div>

                    {/* Price and Application Date */}
                    <div style={styles.priceSection}>
                      <div style={styles.priceInfo}>
                        <span style={styles.priceLabel}>Quoted Price:</span>
                        <div style={styles.priceValue}>
                          €{application.quotedPrice.toFixed(2)}
                        </div>
                      </div>
                      <div style={styles.appliedInfo}>
                        <span style={styles.appliedLabel}>Applied:</span>
                        <div style={styles.appliedDate}>
                          {new Date(application.appliedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div style={styles.contactInfo}>
                      Contact: {application.transporterEmail}
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    style={styles.selectButton}
                    onClick={() => onAcceptApplication(application.id)}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2f855a'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#38a169'}
                  >
                    <CheckCircle size={16} />
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div style={styles.emptyState}>
            <User size={48} style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No applications yet</h3>
            <p style={styles.emptyDescription}>
              Transporters will apply to your delivery. Check back soon!
            </p>
          </div>
        )}

        {/* Tip Section */}
        {applications.length > 0 && (
          <div style={styles.tipSection}>
            <p style={styles.tipText}>
              💡 <strong>Tip:</strong> Compare ratings, completed deliveries, and pricing to choose the best transporter for your delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsModal;