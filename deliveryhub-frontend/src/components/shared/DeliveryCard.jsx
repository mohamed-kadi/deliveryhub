// src/components/shared/DeliveryCard.jsx
import React, { useState } from 'react';
import { 
  MapPin, ArrowRight, Clock, CheckCircle, X, Truck, Euro, 
  User, Calendar, Package, Plus, MessageCircle 
} from 'lucide-react';
import { WithNotificationBadge } from '../NotificationBadge';

const DeliveryCard = ({ 
  delivery, 
  userRole, // 'CUSTOMER' | 'TRANSPORTER' | 'ADMIN'
  onAction,
  pricing = null,
  paymentStatus = null,
  paymentStatusStyle = null,
  unreadCount = 0,
  canRate = false,
  timeRemaining = null,
  hoveredCustomer = null,
  onCustomerHover = null,
  customerRatingCard = null,
  onMouseMove = null,
  hoveredTransporter = null,
  onTransporterHover = null,
  transporterRatingCard = null
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    deliveryCard: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      transition: 'all 0.2s ease',
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: isHovered ? '0 8px 25px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)'
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
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
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
    actionButtons: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px',
      flexWrap: 'wrap'
    },
    button: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
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
    buttonDanger: {
      backgroundColor: '#e53e3e',
      color: 'white'
    },
    buttonSecondary: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    },
    timeAlert: {
      backgroundColor: '#e6fffa',
      border: '1px solid #81e6d9',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px',
      textAlign: 'center'
    },
    declineAlert: {
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: '#fed7d7',
      border: '1px solid #fc8181',
      borderRadius: '8px'
    }
  };

  // Status styling helper
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

  // Render customer-specific actions
  const renderCustomerActions = () => {
    const actions = [];

    if (delivery.status === 'PENDING') {
      actions.push(
        <button
          key="applications"
          style={{...styles.button, ...styles.buttonPrimary}}
          onClick={() => onAction('viewApplications', delivery)}
        >
          <User size={16} />
          View Applications
        </button>
      );
    }

    if (delivery.status === 'DELIVERED' && canRate) {
      actions.push(
        <button
          key="rate"
          style={{...styles.button, ...styles.buttonWarning}}
          onClick={() => onAction('rateTransporter', delivery)}
        >
          ⭐ Rate Transporter
        </button>
      );
    }

    if (delivery.status === 'ASSIGNED') {
      actions.push(
        <button
          key="cancel"
          style={{...styles.button, ...styles.buttonDanger}}
          onClick={() => onAction('cancelDelivery', delivery)}
        >
          <X size={16} />
          Cancel
        </button>
      );
    }

    if (paymentStatus && ['PENDING', 'AWAITING_CASH_PAYMENT'].includes(paymentStatus)) {
      actions.push(
        <button
          key="payment"
          style={{...styles.button, ...styles.buttonPrimary}}
          onClick={() => onAction('showPayment', delivery)}
        >
          <Euro size={16} />
          {paymentStatus === 'AWAITING_CASH_PAYMENT' ? 'Confirm COD' : 'Pay Now'}
        </button>
      );
    }

    if (paymentStatus === 'PAID') {
      actions.push(
        <button
          key="paid"
          style={{...styles.button, ...styles.buttonSuccess}}
          disabled={true}
        >
          <CheckCircle size={16} />
          Payment Complete
        </button>
      );
    }

    if (paymentStatus) {
      actions.push(
        <button
          key="paymentDetails"
          style={{...styles.button, ...styles.buttonSecondary}}
          onClick={() => onAction('paymentDetails', delivery)}
        >
          <Euro size={16} />
          Payment Details
        </button>
      );
    }

    return actions;
  };

  // Render transporter-specific actions
  const renderTransporterActions = () => {
    const actions = [];

    // For REQUESTED deliveries
    if (delivery.status === 'REQUESTED') {
      actions.push(
        <button
          key="accept"
          style={{...styles.button, ...styles.buttonSuccess}}
          onClick={() => onAction('acceptRequest', delivery)}
        >
          <CheckCircle size={16} />
          Accept Request
        </button>
      );
      actions.push(
        <button
          key="decline"
          style={{...styles.button, ...styles.buttonDanger}}
          onClick={() => onAction('declineRequest', delivery)}
        >
          <X size={16} />
          Decline Request
        </button>
      );
    }

    // For available jobs
    if (delivery.status === 'PENDING' && userRole === 'TRANSPORTER') {
      actions.push(
        <button
          key="apply"
          style={{...styles.button, ...styles.buttonPrimary}}
          onClick={() => onAction('applyToJob', delivery)}
        >
          <Plus size={16} />
          Apply to Job
        </button>
      );
    }

    if (delivery.status === 'ASSIGNED' && !delivery.status === 'REQUESTED') {
      actions.push(
        <button
          key="accept"
          style={{...styles.button, ...styles.buttonSuccess}}
          onClick={() => onAction('acceptJob', delivery)}
        >
          <CheckCircle size={16} />
          Accept Job
        </button>
      );
    }

    // Status progression buttons
    const nextStatus = getNextStatus(delivery.status);
    if (nextStatus && delivery.status !== 'REQUESTED') {
      actions.push(
        <button
          key="nextStatus"
          style={{...styles.button, ...styles.buttonPrimary}}
          onClick={() => onAction('updateStatus', delivery, nextStatus)}
        >
          <ArrowRight size={16} />
          Mark as {nextStatus.replace('_', ' ')}
        </button>
      );
    }

    // Decline button for assigned deliveries
    if (delivery.status === 'ASSIGNED' && !delivery.acceptedAt) {
      actions.push(
        <button
          key="decline"
          style={{...styles.button, ...styles.buttonDanger}}
          onClick={() => onAction('declineJob', delivery)}
        >
          <X size={16} />
          Decline
        </button>
      );
    }

    // COD confirmation
    if (paymentStatus === 'AWAITING_CASH_PAYMENT' && delivery.status === 'DELIVERED') {
      actions.push(
        <button
          key="confirmCOD"
          style={{...styles.button, ...styles.buttonSuccess}}
          onClick={() => onAction('confirmCOD', delivery)}
        >
          <CheckCircle size={16} />
          Confirm COD Payment
        </button>
      );
    }

    // Rating button
    if (delivery.status === 'DELIVERED' && canRate) {
      actions.push(
        <button
          key="rate"
          style={{...styles.button, ...styles.buttonWarning}}
          onClick={() => onAction('rateCustomer', delivery)}
        >
          ⭐ Rate Customer
        </button>
      );
    }

    // View details button
    actions.push(
      <button
        key="details"
        style={{...styles.button, ...styles.buttonSecondary}}
        onClick={() => onAction('viewDetails', delivery)}
      >
        📋 View Details
      </button>
    );

    return actions;
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'ASSIGNED': 'PICKED_UP',
      'PICKED_UP': 'IN_TRANSIT',
      'IN_TRANSIT': 'DELIVERED'
    };
    return statusFlow[currentStatus];
  };

  return (
    <div 
      style={styles.deliveryCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div style={styles.deliveryHeader}>
        <div style={styles.deliveryId}>Delivery #{delivery.id}</div>
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

      {/* Route */}
      <div style={styles.deliveryRoute}>
        <MapPin size={16} />
        <span><strong>{delivery.pickupCity}</strong></span>
        <ArrowRight size={16} style={{color: '#3182ce'}} />
        <span><strong>{delivery.dropoffCity}</strong></span>
      </div>

      {/* 48-Hour Timer for REQUESTED deliveries */}
      {delivery.status === 'REQUESTED' && timeRemaining && (
        <div style={styles.timeAlert}>
          {timeRemaining.expired ? (
            <div style={{color: '#e53e3e', fontWeight: '600'}}>
              ⏰ Request Expired - Response time exceeded 48 hours
            </div>
          ) : (
            <div style={{color: '#234e52'}}>
              <div style={{fontWeight: '600', marginBottom: '4px'}}>⏰ Response Required</div>
              <div style={{fontSize: '14px'}}>
                Time remaining: <strong>{timeRemaining.hours}h {timeRemaining.minutes}m</strong>
              </div>
              <div style={{fontSize: '12px', marginTop: '4px', opacity: 0.8}}>
                Please accept or decline this delivery request
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details Grid */}
      <div style={styles.deliveryDetails}>
        {/* Customer/Transporter Info */}
        {userRole === 'TRANSPORTER' && delivery.customerEmail && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>Customer</div>
            <div style={{...styles.detailValue, position: 'relative'}}>
              <User size={14} style={{display: 'inline', marginRight: '4px'}} />
              <span
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  color: '#3182ce',
                  padding: '2px 4px'
                }}
                onMouseEnter={() => onCustomerHover && onCustomerHover(delivery.id)}
                onMouseLeave={() => onCustomerHover && onCustomerHover(null)}
                onMouseMove={(e) => onMouseMove && onMouseMove(e)}

              >
                {delivery.customerEmail}
              </span>
              {hoveredCustomer === delivery.id && customerRatingCard}
            </div>
          </div>
              )}
              
            {userRole === 'CUSTOMER' && delivery.transportEmail && (
            <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Transporter</div>
                <div style={{...styles.detailValue, position: 'relative'}}>
                <User size={14} style={{display: 'inline', marginRight: '4px'}} />
                <span
                    style={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    color: '#3182ce',
                    padding: '2px 4px'
                    }}
                    onMouseEnter={() => onTransporterHover && onTransporterHover(delivery.id)}
                    onMouseLeave={() => onTransporterHover && onTransporterHover(null)}
                    onMouseMove={(e) => onMouseMove && onMouseMove(e)}
                >
                    {delivery.transportEmail}
                </span>
                {hoveredTransporter === delivery.id && transporterRatingCard}
                </div>
            </div>
              )}
              

        {/* {userRole === 'CUSTOMER' && delivery.transportEmail && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>Transporter</div>
            <div style={styles.detailValue}>{delivery.transportEmail}</div>
          </div>
        )} */}

        {/* Item Details */}
        <div style={styles.detailItem}>
          <div style={styles.detailLabel}>Item Type</div>
          <div style={styles.detailValue}>{delivery.itemType}</div>
        </div>

        <div style={styles.detailItem}>
          <div style={styles.detailLabel}>Pickup Date</div>
          <div style={styles.detailValue}>
            <Calendar size={14} style={{display: 'inline', marginRight: '4px'}} />
            {delivery.pickupDate}
          </div>
        </div>

        {/* Pricing/Earnings */}
        {userRole === 'TRANSPORTER' && pricing && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              {delivery.status === 'DELIVERED' ? 'Earnings' : 'Est. Earnings'}
            </div>
            <div style={{...styles.detailValue, color: '#38a169', fontWeight: '600'}}>
              €{pricing.toFixed(2)}
            </div>
          </div>
        )}

        {userRole === 'CUSTOMER' && pricing && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>Total Cost</div>
            <div style={styles.detailValue}>€{pricing}</div>
          </div>
        )}

        {/* Payment Status */}
        {paymentStatus && paymentStatusStyle && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>Payment Status</div>
            <div style={{
              ...styles.detailValue,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600',
                backgroundColor: paymentStatusStyle.bg,
                color: paymentStatusStyle.text,
                border: `1px solid ${paymentStatusStyle.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                {paymentStatus === 'PAID' && <CheckCircle size={14} />}
                {paymentStatus === 'FAILED' && <X size={14} />}
                {paymentStatus === 'AWAITING_CASH_PAYMENT' && <Clock size={14} />}
                {!['PAID', 'FAILED', 'AWAITING_CASH_PAYMENT'].includes(paymentStatus) && <Euro size={14} />}
                {paymentStatus === 'AWAITING_CASH_PAYMENT' ? 'Awaiting COD' : 
                 paymentStatus === 'PENDING' ? 'Payment Due' : 
                 paymentStatus === 'PAID' ? 'Paid' : 
                 paymentStatus === 'FAILED' ? 'Failed' : paymentStatus}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {delivery.description && (
        <div style={{marginBottom: '16px'}}>
          <div style={styles.detailLabel}>Description</div>
          <div style={styles.detailValue}>{delivery.description}</div>
        </div>
      )}

      {/* Decline Alert */}
      {delivery.status === 'DECLINED' && !delivery.declineDismissed && (delivery.declineReason || delivery.declineMessage) && (
        <div style={styles.declineAlert}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div style={{flex: 1}}>
              <div style={{...styles.detailLabel, color: '#742a2a', fontWeight: '600'}}>
                Delivery Declined by Transporter
              </div>
              {delivery.declineReason && (
                <div style={{...styles.detailValue, color: '#742a2a', marginTop: '4px'}}>
                  <strong>Reason:</strong> {delivery.declineReason.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              )}
              {delivery.declineMessage && (
                <div style={{...styles.detailValue, color: '#742a2a', marginTop: '4px'}}>
                  <strong>Message:</strong> {delivery.declineMessage}
                </div>
              )}
            </div>
            <button
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #742a2a',
                color: '#742a2a',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                marginLeft: '12px'
              }}
              onClick={() => onAction('dismissDecline', delivery)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        {/* Role-specific actions */}
        {userRole === 'CUSTOMER' && renderCustomerActions()}
        {userRole === 'TRANSPORTER' && renderTransporterActions()}

        {/* Chat button (common for both roles when appropriate) */}
        {delivery.status !== 'PENDING' && delivery.transporterId && (
          <WithNotificationBadge count={unreadCount}>
            <button
              onClick={() => onAction('openChat', delivery)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              💬 Chat
            </button>
          </WithNotificationBadge>
        )}
      </div>
    </div>
  );
};

export default DeliveryCard;