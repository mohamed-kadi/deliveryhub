// Helper functions for TransporterDashboard and related components

export const calculateTimeRemaining = (requestedAt) => {
  if (!requestedAt) return null;
  
  const requestTime = new Date(requestedAt);
  const expiryTime = new Date(requestTime.getTime() + (48 * 60 * 60 * 1000)); // 48 hours
  const now = new Date();
  const timeLeft = expiryTime - now;
  
  if (timeLeft <= 0) return { expired: true };
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  return { expired: false, hours, minutes };
};

export const getPaymentStatusColor = (status) => {
  const colors = {
    'PENDING': { bg: '#fef5e7', text: '#744210', border: '#f6e05e' },
    'AWAITING_CASH_PAYMENT': { bg: '#ebf8ff', text: '#2a4a6b', border: '#90cdf4' },
    'PAID': { bg: '#f0fff4', text: '#22543d', border: '#68d391' },
    'FAILED': { bg: '#fed7d7', text: '#742a2a', border: '#fc8181' }
  };
  return colors[status] || colors['PENDING'];
};

export const getPaymentStatusDisplayName = (status) => {
  switch (status) {
    case 'AWAITING_CASH_PAYMENT': return 'COD Ready';
    case 'PENDING': return 'Payment Due';
    case 'PAID': return 'Paid';
    case 'FAILED': return 'Failed';
    default: return status;
  }
};

export const getStatusColor = (status) => {
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

export const getNextStatus = (currentStatus) => {
  const statusFlow = {
    'ASSIGNED': 'PICKED_UP',
    'PICKED_UP': 'IN_TRANSIT',
    'IN_TRANSIT': 'DELIVERED'
  };
  return statusFlow[currentStatus];
};

export const getStatusIcon = (status) => {
  // Note: Icons need to be imported in the component that uses this function
  // This function returns the icon name/type, not the actual icon component
  switch (status) {
    case 'REQUESTED': return 'Clock';
    case 'DELIVERED': return 'CheckCircle';
    case 'CANCELLED': 
    case 'DECLINED': return 'X';
    case 'IN_TRANSIT': 
    case 'PICKED_UP': return 'Truck';
    default: return 'Clock';
  }
};