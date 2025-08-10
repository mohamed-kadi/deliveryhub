// src/components/ProfileHeader.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfileHeader = ({ title = "Dashboard" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
  };

  const handleProfileSettings = () => {
    // TODO: Navigate to profile settings page
    console.log('Navigate to profile settings');
    setDropdownOpen(false);
  };

  const handleNotifications = () => {
    // TODO: Open notifications panel
    console.log('Open notifications');
    setDropdownOpen(false);
  };

  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0)?.toUpperCase() || 'U';
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'CUSTOMER':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'TRANSPORTER':
        return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'ADMIN':
        return { backgroundColor: '#f3e8ff', color: '#7c3aed' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const styles = {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1f2937',
      margin: 0
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    notificationButton: {
      position: 'relative',
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#6b7280',
      fontSize: '20px',
      transition: 'all 0.2s ease'
    },
    notificationBadge: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      width: '8px',
      height: '8px',
      backgroundColor: '#ef4444',
      borderRadius: '50%',
      border: '2px solid white'
    },
    profileContainer: {
      position: 'relative'
    },
    profileButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 12px',
      backgroundColor: 'transparent',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    profileButtonHover: {
      backgroundColor: '#f9fafb',
      borderColor: '#d1d5db'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600'
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937',
      lineHeight: '1.2'
    },
    userRole: {
      fontSize: '12px',
      fontWeight: '500',
      padding: '2px 6px',
      borderRadius: '4px',
      lineHeight: '1.2',
      marginTop: '2px'
    },
    chevron: {
      fontSize: '16px',
      color: '#6b7280',
      transition: 'transform 0.2s ease',
      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: '0',
      marginTop: '8px',
      minWidth: '200px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 50
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      padding: '12px 16px',
      backgroundColor: 'transparent',
      border: 'none',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#374151',
      transition: 'all 0.2s ease'
    },
    dropdownItemHover: {
      backgroundColor: '#f9fafb'
    },
    dropdownIcon: {
      fontSize: '16px',
      color: '#6b7280'
    },
    dropdownDivider: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      margin: '4px 0'
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <h1 style={styles.title}>{title}</h1>
      </div>

      <div style={styles.rightSection}>
        {/* Notifications Button */}
        <button
          style={styles.notificationButton}
          onClick={handleNotifications}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
          title="Notifications"
        >
          🔔
          {/* Show notification badge if there are unread notifications */}
          <div style={styles.notificationBadge}></div>
        </button>

        {/* Profile Dropdown */}
        <div style={styles.profileContainer} ref={dropdownRef}>
          <button
            style={styles.profileButton}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.profileButtonHover);
            }}
            onMouseLeave={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }
            }}
          >
            <div style={styles.avatar}>
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.fullName || user.email}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                getUserInitials()
              )}
            </div>
            
            <div style={styles.userInfo}>
              <div style={styles.userName}>
                {user?.fullName || user?.email?.split('@')[0] || 'User'}
              </div>
              <div style={{
                ...styles.userRole,
                ...getRoleBadgeColor()
              }}>
                {user?.role?.toLowerCase() || 'user'}
              </div>
            </div>
            
            <span style={styles.chevron}>▼</span>
          </button>

          {dropdownOpen && (
            <div style={styles.dropdown}>
              <button
                style={styles.dropdownItem}
                onClick={handleProfileSettings}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.dropdownItemHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={styles.dropdownIcon}>⚙️</span>
                Profile Settings
              </button>
              
              <button
                style={styles.dropdownItem}
                onClick={handleNotifications}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.dropdownItemHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={styles.dropdownIcon}>🔔</span>
                Notifications
              </button>
              
              <div style={styles.dropdownDivider}></div>
              
              <button
                style={{
                  ...styles.dropdownItem,
                  color: '#dc2626'
                }}
                onClick={handleSignOut}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={styles.dropdownIcon}>🚪</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;