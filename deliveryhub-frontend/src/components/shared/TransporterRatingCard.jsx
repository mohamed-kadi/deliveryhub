import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../../services/apiClient';

const TransporterRatingCard = ({ transporterId, transporterEmail, mousePosition }) => {
  const [transporterRating, setTransporterRating] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransporterRating = async () => {
      try {
        const response = await apiClient.get(`/ratings/transporter/${transporterId}/rating-summary`);
        setTransporterRating(response.data);
      } catch (error) {
        console.error('Error fetching transporter rating:', error);
      } finally {
        setLoading(false);
      }
    };

    if (transporterId) {
      fetchTransporterRating();
    }
  }, [transporterId, transporterEmail]);

  // Don't render anything if no transporterId
  if (!transporterId) return null;

  const styles = {
    card: {
      position: 'fixed',
      top: mousePosition?.y ? `${mousePosition.y + 10}px` : '50%',
      left: mousePosition?.x ? `${mousePosition.x + 10}px` : '50%',
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      zIndex: 9999,
      minWidth: '250px',
      maxWidth: '320px',
      pointerEvents: 'none',
      transform: mousePosition ? 'none' : 'translate(-50%, -50%)'
    },
    cardExpanded: {
      padding: '16px',
      minWidth: '280px',
      maxWidth: '320px'
    },
    transporterName: {
      margin: '0 0 4px 0',
      fontSize: '14px',
      fontWeight: '600'
    },
    transporterEmail: {
      fontSize: '12px',
      color: '#718096'
    },
    ratingSection: {
      marginBottom: '12px'
    },
    ratingDisplay: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    starRating: {
      fontSize: '16px',
      color: '#d69e2e'
    },
    reviewCount: {
      fontSize: '12px',
      color: '#718096'
    },
    noRating: {
      fontSize: '12px',
      color: '#718096'
    },
    feedbackSection: {
      marginTop: '12px'
    },
    feedbackLabel: {
      fontSize: '12px',
      color: '#718096',
      marginBottom: '6px'
    },
    feedbackItem: {
      fontSize: '11px',
      color: '#4a5568',
      fontStyle: 'italic',
      marginBottom: '4px',
      padding: '4px 8px',
      backgroundColor: '#f7fafc',
      borderRadius: '4px'
    },
    loadingText: {
      textAlign: 'center',
      color: '#718096'
    }
  };

  const tooltipContent = loading ? (
    <div style={styles.card}>
      <div style={styles.loadingText}>Loading...</div>
    </div>
  ) : !transporterRating ? (
    <div style={styles.card}>
      <div style={styles.loadingText}>No rating data</div>
    </div>
  ) : (
    <div style={{...styles.card, ...styles.cardExpanded}}>
      <div style={{marginBottom: '12px'}}>
        <h4 style={styles.transporterName}>
          {transporterRating.transporterName}
        </h4>
        <div style={styles.transporterEmail}>
          {transporterEmail}
        </div>
      </div>

      <div style={styles.ratingSection}>
        {transporterRating.totalRatings > 0 ? (
          <div style={styles.ratingDisplay}>
            <span style={styles.starRating}>
              ⭐ {transporterRating.averageRating.toFixed(1)}
            </span>
            <span style={styles.reviewCount}>
              ({transporterRating.totalRatings} reviews)
            </span>
          </div>
        ) : (
          <div style={styles.noRating}>
            No ratings yet
          </div>
        )}
      </div>

      {transporterRating.recentFeedback && transporterRating.recentFeedback.length > 0 && (
        <div style={styles.feedbackSection}>
          <div style={styles.feedbackLabel}>
            Recent feedback:
          </div>
          {transporterRating.recentFeedback.slice(0, 2).map((feedback, index) => (
            <div key={index} style={styles.feedbackItem}>
              "{feedback}"
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return createPortal(tooltipContent, document.body);
};

export default TransporterRatingCard;