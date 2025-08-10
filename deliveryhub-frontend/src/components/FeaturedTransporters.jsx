// src/components/FeaturedTransporters.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const FeaturedTransporters = ({ onBookTransporter }) => {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured transporters on component mount
  useEffect(() => {
    fetchFeaturedTransporters();
  }, []);

  const fetchFeaturedTransporters = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/transporters/featured');
      setTransporters(response.data || []);
    } catch (error) {
      console.error('Error fetching featured transporters:', error);
      setTransporters([]);
    } finally {
      setLoading(false);
    }
  };

  // Get tier badge styling
  const getTierBadge = (tier) => {
    switch (tier) {
      case 'PRO':
        return { color: '#7c3aed', backgroundColor: '#f3e8ff', text: '⭐ PRO' };
      case 'PREMIUM':
        return { color: '#dc2626', backgroundColor: '#fef2f2', text: '💎 PREMIUM' };
      default:
        return { color: '#059669', backgroundColor: '#ecfdf5', text: '✓ VERIFIED' };
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={styles.starFilled}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} style={styles.starHalf}>☆</span>);
      } else {
        stars.push(<span key={i} style={styles.starEmpty}>☆</span>);
      }
    }
    return stars;
  };

  const styles = {
    container: {
      marginBottom: '32px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1f2937',
      margin: 0
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '4px'
    },
    transportersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '20px'
    },
    transporterCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    transporterCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    },
    avatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: '600',
      color: '#6b7280',
      marginRight: '16px'
    },
    transporterInfo: {
      flex: 1
    },
    transporterName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '4px'
    },
    tierBadge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px'
    },
    ratingStars: {
      display: 'flex',
      alignItems: 'center'
    },
    starFilled: {
      color: '#fbbf24',
      fontSize: '16px'
    },
    starHalf: {
      color: '#fbbf24',
      fontSize: '16px'
    },
    starEmpty: {
      color: '#d1d5db',
      fontSize: '16px'
    },
    ratingText: {
      fontSize: '14px',
      color: '#6b7280'
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    },
    stat: {
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937'
    },
    statLabel: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '2px'
    },
    specialties: {
      marginBottom: '16px'
    },
    specialtiesTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    specialtyTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    },
    specialtyTag: {
      padding: '4px 8px',
      backgroundColor: '#e0f2fe',
      color: '#0891b2',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500'
    },
    bookButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    bookButtonHover: {
      backgroundColor: '#2563eb'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px',
      color: '#6b7280'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px',
      color: '#6b7280'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Featured Transporters</h2>
            <p style={styles.subtitle}>Top-rated transporters ready to serve you</p>
          </div>
        </div>
        <div style={styles.loadingContainer}>
          <div>Loading featured transporters...</div>
        </div>
      </div>
    );
  }

  if (transporters.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Featured Transporters</h2>
            <p style={styles.subtitle}>Top-rated transporters ready to serve you</p>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🚚</div>
          <div>No featured transporters available at the moment</div>
          <div style={{ fontSize: '14px', marginTop: '8px', color: '#9ca3af' }}>
            Check back later or post a delivery request
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Featured Transporters</h2>
          <p style={styles.subtitle}>Top-rated transporters ready to serve you</p>
        </div>
      </div>

      <div style={styles.transportersGrid}>
        {transporters.map((transporter) => {
          const tierBadge = getTierBadge(transporter.tier);
          
          return (
            <div
              key={transporter.id}
              style={styles.transporterCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.transporterCardHover);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>
                  {transporter.profileImage ? (
                    <img 
                      src={transporter.profileImage} 
                      alt={transporter.fullName}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    transporter.fullName?.charAt(0)?.toUpperCase() || '👤'
                  )}
                </div>
                <div style={styles.transporterInfo}>
                  <div style={styles.transporterName}>{transporter.fullName}</div>
                  <span style={{ ...styles.tierBadge, color: tierBadge.color, backgroundColor: tierBadge.backgroundColor }}>
                    {tierBadge.text}
                  </span>
                  <div style={styles.rating}>
                    <div style={styles.ratingStars}>
                      {renderStars(transporter.averageRating || 4.5)}
                    </div>
                    <span style={styles.ratingText}>
                      {(transporter.averageRating || 4.5).toFixed(1)} ({transporter.totalRatings || 23} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.stats}>
                <div style={styles.stat}>
                  <div style={styles.statNumber}>{transporter.completedDeliveries || 147}</div>
                  <div style={styles.statLabel}>Deliveries</div>
                </div>
                <div style={styles.stat}>
                  <div style={styles.statNumber}>{transporter.responseTime || '< 1h'}</div>
                  <div style={styles.statLabel}>Response</div>
                </div>
                <div style={styles.stat}>
                  <div style={styles.statNumber}>{((transporter.successRate || 0.98) * 100).toFixed(0)}%</div>
                  <div style={styles.statLabel}>Success Rate</div>
                </div>
              </div>

              {transporter.specialties && transporter.specialties.length > 0 && (
                <div style={styles.specialties}>
                  <div style={styles.specialtiesTitle}>Specialties</div>
                  <div style={styles.specialtyTags}>
                    {transporter.specialties.slice(0, 3).map((specialty, index) => (
                      <span key={index} style={styles.specialtyTag}>
                        {specialty}
                      </span>
                    ))}
                    {transporter.specialties.length > 3 && (
                      <span style={styles.specialtyTag}>
                        +{transporter.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button
                style={styles.bookButton}
                onClick={() => onBookTransporter(transporter)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.bookButtonHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.bookButton.backgroundColor;
                }}
              >
                Book {transporter.fullName?.split(' ')[0] || 'Transporter'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedTransporters;