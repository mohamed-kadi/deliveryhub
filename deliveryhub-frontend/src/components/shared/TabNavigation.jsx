// src/components/shared/TabNavigation.jsx
import React from 'react';

const TabNavigation = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  style = 'tabs' // 'tabs' or 'pills'
}) => {
  const styles = {
    container: {
      display: 'flex',
      borderBottom: style === 'tabs' ? '1px solid #e2e8f0' : 'none',
      marginBottom: '24px',
      gap: style === 'pills' ? '8px' : '0'
    },
    tab: {
      padding: '12px 24px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      borderBottom: style === 'tabs' ? '2px solid transparent' : 'none',
      borderRadius: style === 'pills' ? '8px' : '0',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    tabActive: {
      color: '#3182ce',
      borderBottomColor: style === 'tabs' ? '#3182ce' : 'transparent',
      backgroundColor: style === 'pills' ? '#ebf8ff' : 'transparent'
    },
    tabInactive: {
      color: '#718096',
      backgroundColor: style === 'pills' ? '#f7fafc' : 'transparent'
    },
    tabHover: {
      color: '#3182ce',
      backgroundColor: style === 'pills' ? '#f0f9ff' : '#f7fafc'
    }
  };

  return (
    <div style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        
        return (
          <button
            key={tab.key}
            style={{
              ...styles.tab,
              ...(isActive ? styles.tabActive : styles.tabInactive)
            }}
            onClick={() => onTabChange(tab.key)}
            onMouseEnter={(e) => {
              if (!isActive) {
                Object.assign(e.target.style, styles.tabHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                Object.assign(e.target.style, {
                  color: styles.tabInactive.color,
                  backgroundColor: styles.tabInactive.backgroundColor
                });
              }
            }}
          >
            {tab.icon && <tab.icon size={16} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span style={{
                backgroundColor: isActive ? '#3182ce' : '#cbd5e0',
                color: isActive ? 'white' : '#4a5568',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span style={{
                backgroundColor: tab.badge.color || '#ef4444',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                {tab.badge.text}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;