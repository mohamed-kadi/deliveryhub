// src/components/NotificationBadge.jsx
import React from 'react';

const NotificationBadge = ({ count, maxCount = 99 }) => {
  // Don't render if no unread messages
  if (!count || count <= 0) {
    return null;
  }

  // Format count (show 99+ for large numbers)
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const styles = {
    badge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#ef4444', // Red color
      color: 'white',
      borderRadius: '50%',
      minWidth: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '600',
      lineHeight: '1',
      padding: count > 9 ? '2px 6px' : '0', // More padding for double digits
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      border: '2px solid white', // White border for better visibility
      zIndex: 10,
      animation: count > 0 ? 'pulse 2s infinite' : 'none'
    },
    container: {
      position: 'relative',
      display: 'inline-block'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={styles.badge}>
        {displayCount}
      </div>
    </>
  );
};

// Higher-order component to wrap buttons with notification badge
export const WithNotificationBadge = ({ children, count, maxCount = 99, style = {} }) => {
  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
    ...style
  };

  return (
    <div style={containerStyle}>
      {children}
      <NotificationBadge count={count} maxCount={maxCount} />
    </div>
  );
};

export default NotificationBadge;