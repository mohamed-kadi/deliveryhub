// src/components/TransporterProfileHeader.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

const TransporterProfileHeader = ({ 
  title = "Transporter Dashboard",
  subtitle = "Manage your deliveries and earn money",
  isAvailable,
  onAvailabilityChange,
  loadingAvailability = false,
  onRefresh
}) => {
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
    return user?.email?.charAt(0)?.toUpperCase() || 'T';
  };

  const styles = {
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '24px',
      paddingBottom: '24px'
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column'
    },
    headerTitle: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#1a202c',
      margin: 0
    },
    headerSubtitle: {
      fontSize: '14px',
      color: '#718096',
      marginTop: '4px'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    availabilitySection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid',
      transition: 'all 0.2s'
    },
    availabilityDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%'
    },
    availabilityText: {
      fontSize: '12px',
      fontWeight: '500'
    },
    availabilityToggle: {
      position: 'relative',
      display: 'inline-block',
      width: '44px',
      height: '24px',
      marginLeft: '8px'
    },
    availabilityInput: {
      opacity: 0,
      width: 0,
      height: 0
    },
    availabilitySlider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '24px',
      transition: 'all 0.2s'
    },
    availabilitySliderButton: {
      position: 'absolute',
      height: '18px',
      width: '18px',
      bottom: '3px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
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
    refreshButton: {
      padding: '10px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#3182ce',
      color: 'white'
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
      marginTop: '2px',
      backgroundColor: '#d1fae5',
      color: '#065f46'
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
    dropdownDivider: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      margin: '4px 0'
    }
  };

  const getAvailabilityStyles = () => {
    if (isAvailable) {
      return {
        container: {
          ...styles.availabilitySection,
          backgroundColor: '#f0fff4',
          borderColor: '#68d391'
        },
        dot: {
          ...styles.availabilityDot,
          backgroundColor: '#38a169'
        },
        text: {
          ...styles.availabilityText,
          color: '#22543d'
        },
        slider: {
          ...styles.availabilitySlider,
          backgroundColor: '#38a169'
        },
        sliderButton: {
          ...styles.availabilitySliderButton,
          left: '23px'
        }
      };
    } else {
      return {
        container: {
          ...styles.availabilitySection,
          backgroundColor: '#fed7d7',
          borderColor: '#fc8181'
        },
        dot: {
          ...styles.availabilityDot,
          backgroundColor: '#e53e3e'
        },
        text: {
          ...styles.availabilityText,
          color: '#742a2a'
        },
        slider: {
          ...styles.availabilitySlider,
          backgroundColor: '#cbd5e0'
        },
        sliderButton: {
          ...styles.availabilitySliderButton,
          left: '3px'
        }
      };
    }
  };

  const availabilityStyles = getAvailabilityStyles();

  return (
    <div style={styles.header}>
      <div style={styles.headerContent}>
        {/* Left Section - Title */}
        <div style={styles.leftSection}>
          <h1 style={styles.headerTitle}>
            Welcome back, {user?.fullName || 'Transporter'}! 🚚
          </h1>
          <p style={styles.headerSubtitle}>{subtitle}</p>
        </div>

        {/* Right Section - Controls */}
        <div style={styles.rightSection}>
          {/* Availability Toggle */}
          <div style={availabilityStyles.container}>
            <div style={availabilityStyles.dot}></div>
            <span style={availabilityStyles.text}>
              {isAvailable ? 'Available' : 'Offline'}
            </span>
            <label style={styles.availabilityToggle}>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => onAvailabilityChange && onAvailabilityChange(e.target.checked)}
                disabled={loadingAvailability}
                style={styles.availabilityInput}
              />
              <span style={{
                ...availabilityStyles.slider,
                transform: loadingAvailability ? 'scale(0.95)' : 'scale(1)'
              }}>
                <span style={availabilityStyles.sliderButton}></span>
              </span>
            </label>
          </div>

          {/* Refresh Button */}
          <button
            style={styles.refreshButton}
            onClick={onRefresh}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2c5282'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

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
            <div style={styles.notificationBadge}></div>
          </button>

          {/* Profile Dropdown */}
          <div style={styles.profileContainer} ref={dropdownRef}>
            <button
              style={styles.profileButton}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
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
                  {user?.fullName || user?.email?.split('@')[0] || 'Transporter'}
                </div>
                <div style={styles.userRole}>
                  transporter
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
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>⚙️</span>
                  Profile Settings
                </button>
                
                <button
                  style={styles.dropdownItem}
                  onClick={handleNotifications}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>🔔</span>
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
                  <span>🚪</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterProfileHeader;