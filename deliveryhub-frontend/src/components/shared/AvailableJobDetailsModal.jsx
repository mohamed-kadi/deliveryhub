import React from 'react';
import { X, ArrowRight, Plus, CheckCircle, Clock, Truck } from 'lucide-react';

const AvailableJobDetailsModal = ({
  isOpen,
  onClose,
  job,
  onApply,
  onAccept,
  calculateEarnings,
  pricingExists
}) => {
  if (!isOpen || !job) return null;

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
      marginBottom: '20px'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '0',
      color: '#1a202c'
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
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
    buttonSecondary: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    }
  };

  return (
    <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Job Details</h3>
          <button 
            style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#718096'}}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div style={{marginBottom: '20px'}}>
          <h4 style={{color: '#1a202c'}}>Delivery #{job.id}</h4>
          <div style={{
            ...styles.statusBadge, 
            backgroundColor: getStatusColor(job.status).bg, 
            color: getStatusColor(job.status).text, 
            border: `1px solid ${getStatusColor(job.status).border}`, 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px', 
            marginTop: '8px'
          }}>
            {getStatusIcon(job.status)}
            {job.status}
          </div>
        </div>

        {/* Route Information */}
        <div style={{backgroundColor: '#f7fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px'}}>
          <h5 style={{color: '#1a202c', marginBottom: '12px'}}>📍 Route Information</h5>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
            <span style={{fontSize: '16px', fontWeight: '600'}}>{job.pickupCity}</span>
            <ArrowRight size={16} style={{color: '#3182ce'}} />
            <span style={{fontSize: '16px', fontWeight: '600'}}>{job.dropoffCity}</span>
          </div>
          <div style={{fontSize: '14px', color: '#718096'}}>
            📅 Pickup Date: {job.pickupDate}
          </div>
        </div>

        {/* Customer Information */}
        <div style={{backgroundColor: '#f7fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px'}}>
          <h5 style={{color: '#1a202c', marginBottom: '12px'}}>👤 Customer Information</h5>
          <div style={{fontSize: '14px', color: '#4a5568'}}>
            <div style={{marginBottom: '4px'}}>
              <strong>Email:</strong> {job.customerEmail}
            </div>
          </div>
        </div>

        {/* Package Information */}
        <div style={{backgroundColor: '#f7fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px'}}>
          <h5 style={{color: '#1a202c', marginBottom: '12px'}}>📦 Package Information</h5>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <div>
              <span style={{fontSize: '12px', color: '#718096'}}>Item Type:</span>
              <div style={{fontSize: '14px', fontWeight: '500'}}>{job.itemType}</div>
            </div>
            <div>
              <span style={{fontSize: '12px', color: '#718096'}}>Weight:</span>
              <div style={{fontSize: '14px', fontWeight: '500'}}>
                {job.weightKg ? `${job.weightKg} kg` : 'Not specified'}
              </div>
            </div>
          </div>
          
          {job.description && (
            <div style={{marginTop: '12px'}}>
              <span style={{fontSize: '12px', color: '#718096'}}>Description:</span>
              <div style={{fontSize: '14px', color: '#4a5568', marginTop: '4px', padding: '8px', backgroundColor: 'white', borderRadius: '4px'}}>
                {job.description}
              </div>
            </div>
          )}
        </div>

        {/* Estimated Earnings */}
        {pricingExists && job.weightKg && calculateEarnings && (
          <div style={{backgroundColor: '#f0fff4', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #9ae6b4'}}>
            <h5 style={{color: '#22543d', marginBottom: '8px'}}>💰 Your Estimated Earnings</h5>
            <div style={{fontSize: '20px', fontWeight: '700', color: '#38a169'}}>
              €{calculateEarnings(job.weightKg || 0).toFixed(2)}
            </div>
            <div style={{fontSize: '12px', color: '#22543d', marginTop: '4px'}}>
              Based on your current pricing configuration
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{display: 'flex', gap: '8px', marginTop: '20px'}}>
          {job.status === 'PENDING' ? (
            <button
              style={{...styles.button, ...styles.buttonPrimary, flex: 1}}
              onClick={() => {
                onClose();
                onApply(job.id);
              }}
            >
              <Plus size={16} />
              Apply to This Job
            </button>
          ) : (
            <button
              style={{...styles.button, ...styles.buttonSuccess, flex: 1}}
              onClick={() => {
                onClose();
                onAccept(job.id);
              }}
            >
              <CheckCircle size={16} />
              Accept This Job
            </button>
          )}
          <button
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailableJobDetailsModal;