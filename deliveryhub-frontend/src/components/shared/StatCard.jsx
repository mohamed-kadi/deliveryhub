// src/components/shared/StatCard.jsx
import React from 'react';

const StatCard = ({ 
  icon: Icon, 
  color, 
  label, 
  value, 
  onClick = null 
}) => {
  const styles = {
    statCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease'
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${color}20` // 20% opacity background
    },
    statContent: {
      flex: 1
    },
    statLabel: {
      fontSize: '14px',
      color: '#718096',
      margin: 0,
      fontWeight: '500'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1a202c',
      margin: '4px 0 0 0'
    }
  };

  return (
    <div 
      style={styles.statCard}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        }
      }}
    >
      <div style={styles.statIcon}>
        <Icon style={{ color }} size={24} />
      </div>
      <div style={styles.statContent}>
        <p style={styles.statLabel}>{label}</p>
        <p style={styles.statValue}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;