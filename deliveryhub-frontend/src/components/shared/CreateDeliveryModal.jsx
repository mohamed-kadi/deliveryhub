// src/components/shared/CreateDeliveryModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Plus, CheckCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';

const CreateDeliveryModal = ({
  isOpen,
  onClose,
  onSubmit,
  preSelectedTransporter = null, // From featured transporters
  availableTransporters = [],
  onTransporterSelect = null // Callback when transporter selection changes
}) => {
  const [deliveryForm, setDeliveryForm] = useState({
    pickupCity: '',
    dropoffCity: '',
    itemType: '',
    description: '',
    weightKg: '',
    pickupDate: ''
  });

  const [assignmentMethod, setAssignmentMethod] = useState('direct'); // 'direct' or 'marketplace'
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [showMarketplace, setShowMarketplace] = useState(false);

  // Initialize with pre-selected transporter if provided
  useEffect(() => {
    if (preSelectedTransporter) {
      setSelectedTransporter(preSelectedTransporter);
      setAssignmentMethod('direct');
      setShowMarketplace(false);
      
      // Calculate cost if weight is already entered
      if (deliveryForm.weightKg) {
        calculateEstimatedCost(preSelectedTransporter.id, parseFloat(deliveryForm.weightKg));
      }
    }
  }, [preSelectedTransporter, deliveryForm.weightKg]);

  const calculateEstimatedCost = async (transporterId, weight) => {
    if (!transporterId || !weight || weight <= 0) {
      setEstimatedCost(null);
      return;
    }

    try {
      const response = await apiClient.get(`/marketplace/transporters/${transporterId}/estimate?weight=${weight}`);
      setEstimatedCost(response.data);
    } catch (error) {
      console.error('Error calculating cost:', error);
      setEstimatedCost(null);
    }
  };

  const handleTransporterSelect = (transporter) => {
    setSelectedTransporter(transporter);
    setShowMarketplace(false);
    
    if (deliveryForm.weightKg) {
      calculateEstimatedCost(transporter.id, parseFloat(deliveryForm.weightKg));
    }
    
    if (onTransporterSelect) {
      onTransporterSelect(transporter);
    }
  };

  const handleSubmit = async () => {
    if (!deliveryForm.pickupCity || !deliveryForm.dropoffCity || !deliveryForm.itemType || 
        !deliveryForm.weightKg || !deliveryForm.pickupDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (assignmentMethod === 'direct' && !selectedTransporter) {
      alert('Please select a transporter first');
      return;
    }

    const submissionData = {
      ...deliveryForm,
      weightKg: parseFloat(deliveryForm.weightKg),
      transporterId: assignmentMethod === 'direct' ? selectedTransporter?.id : null,
      assignmentMethod,
      estimatedCost
    };

    try {
      await onSubmit(submissionData);
      handleClose();
    } catch (error) {
      console.error('Error creating delivery:', error);
    }
  };

  const handleClose = () => {
    setDeliveryForm({
      pickupCity: '',
      dropoffCity: '',
      itemType: '',
      description: '',
      weightKg: '',
      pickupDate: ''
    });
    setAssignmentMethod('direct');
    setSelectedTransporter(preSelectedTransporter); // Keep pre-selected if exists
    setEstimatedCost(null);
    setShowMarketplace(false);
    onClose();
  };

  const handleWeightChange = (e) => {
    const newWeight = e.target.value;
    setDeliveryForm({ ...deliveryForm, weightKg: newWeight });
    
    if (selectedTransporter && newWeight) {
      calculateEstimatedCost(selectedTransporter.id, parseFloat(newWeight));
    }
  };

  if (!isOpen) return null;

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
      maxWidth: '700px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1a202c',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#718096',
      padding: '4px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#4a5568'
    },
    input: {
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s',
      width: '100%',
      boxSizing: 'border-box'
    },
    textarea: {
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      transition: 'border-color 0.2s',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    preSelectedAlert: {
      backgroundColor: '#f0fff4',
      border: '1px solid #9ae6b4',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px'
    },
    assignmentMethodContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px'
    },
    assignmentOption: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      flex: 1,
      transition: 'all 0.2s'
    },
    assignmentOptionActive: {
      backgroundColor: '#ebf8ff',
      borderColor: '#3182ce'
    },
    transporterListContainer: {
      maxHeight: '300px',
      overflowY: 'auto',
      border: '1px solid #e2e8f0',
      borderRadius: '8px'
    },
    transporterCard: {
      padding: '16px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    selectedTransporterCard: {
      padding: '12px',
      border: '2px solid #38a169',
      borderRadius: '8px',
      backgroundColor: '#f0fff4'
    },
    marketplaceAlert: {
      padding: '16px',
      backgroundColor: '#f0fff4',
      border: '1px solid #9ae6b4',
      borderRadius: '8px',
      textAlign: 'center'
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    button: {
      padding: '12px 16px',
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
      color: 'white',
      flex: 1
    },
    buttonSecondary: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    },
    buttonSuccess: {
      backgroundColor: '#38a169',
      color: 'white'
    }
  };

  return (
    <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Create New Delivery</h2>
          <button style={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Pre-selected Transporter Alert */}
        {preSelectedTransporter && (
          <div style={styles.preSelectedAlert}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '16px' }}>✅</span>
              <span style={{ fontWeight: '600', color: '#22543d' }}>Transporter Pre-selected</span>
            </div>
            <div style={{ fontSize: '14px', color: '#22543d' }}>
              {preSelectedTransporter.fullName} - ⭐ {preSelectedTransporter.averageRating?.toFixed(1) || 'N/A'}
              ({preSelectedTransporter.totalRatings || 0} reviews)
            </div>
          </div>
        )}

        <div style={styles.form}>
          {/* Pickup City */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Pickup City *</label>
            <input
              type="text"
              value={deliveryForm.pickupCity}
              onChange={(e) => setDeliveryForm({ ...deliveryForm, pickupCity: e.target.value })}
              style={styles.input}
              placeholder="e.g., Paris, Madrid, Berlin"
            />
          </div>

          {/* Dropoff City */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Dropoff City *</label>
            <input
              type="text"
              value={deliveryForm.dropoffCity}
              onChange={(e) => setDeliveryForm({ ...deliveryForm, dropoffCity: e.target.value })}
              style={styles.input}
              placeholder="e.g., Casablanca, Rabat, Marrakech"
            />
          </div>

          {/* Item Type */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Item Type *</label>
            <input
              type="text"
              value={deliveryForm.itemType}
              onChange={(e) => setDeliveryForm({ ...deliveryForm, itemType: e.target.value })}
              style={styles.input}
              placeholder="e.g., Electronics, Clothing, Documents"
            />
          </div>

          {/* Weight */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Weight (kg) *</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={deliveryForm.weightKg}
              onChange={handleWeightChange}
              style={styles.input}
              placeholder="Enter weight in kg"
            />
          </div>

          {/* Pickup Date */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Pickup Date *</label>
            <input
              type="date"
              value={deliveryForm.pickupDate}
              onChange={(e) => setDeliveryForm({ ...deliveryForm, pickupDate: e.target.value })}
              style={styles.input}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={deliveryForm.description}
              onChange={(e) => setDeliveryForm({ ...deliveryForm, description: e.target.value })}
              style={styles.textarea}
              placeholder="Additional details about the item..."
            />
          </div>

          {/* Assignment Method Selection */}
          {!preSelectedTransporter && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Choose Assignment Method *</label>
              <div style={styles.assignmentMethodContainer}>
                <label style={{
                  ...styles.assignmentOption,
                  ...(assignmentMethod === 'direct' ? styles.assignmentOptionActive : {})
                }}>
                  <input
                    type="radio"
                    name="assignmentMethod"
                    value="direct"
                    checked={assignmentMethod === 'direct'}
                    onChange={(e) => setAssignmentMethod(e.target.value)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>🎯 Direct Assignment</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>Choose from verified transporters</div>
                  </div>
                </label>

                <label style={{
                  ...styles.assignmentOption,
                  ...(assignmentMethod === 'marketplace' ? styles.assignmentOptionActive : {})
                }}>
                  <input
                    type="radio"
                    name="assignmentMethod"
                    value="marketplace"
                    checked={assignmentMethod === 'marketplace'}
                    onChange={(e) => setAssignmentMethod(e.target.value)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>🏪 Post to Marketplace</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>Let transporters compete for your job</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Direct Assignment - Transporter Selection */}
          {assignmentMethod === 'direct' && !selectedTransporter && (
            <div>
              <button
                type="button"
                style={{ ...styles.button, ...styles.buttonSecondary, width: '100%', justifyContent: 'center' }}
                onClick={() => setShowMarketplace(true)}
              >
                Browse Available Transporters
              </button>

              {showMarketplace && (
                <div style={{ marginTop: '12px' }}>
                  <h4 style={{ marginBottom: '12px' }}>Available Transporters:</h4>
                  <div style={styles.transporterListContainer}>
                    {availableTransporters.map(transporter => (
                      <div
                        key={transporter.id}
                        style={styles.transporterCard}
                        onClick={() => handleTransporterSelect(transporter)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{transporter.fullName}</h5>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '14px', color: '#d69e2e' }}>
                                ⭐ {transporter.averageRating?.toFixed(1) || 'N/A'}
                              </span>
                              <span style={{ fontSize: '12px', color: '#718096' }}>
                                ({transporter.totalRatings || 0} reviews)
                              </span>
                              <span style={{ fontSize: '12px', color: '#718096' }}>
                                • {transporter.completedDeliveries || 0} deliveries
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#4a5568' }}>
                              <span>Under {transporter.weightThreshold || 0}kg: €{transporter.fixedPriceUnderThreshold || 0} • </span>
                              <span>Over {transporter.weightThreshold || 0}kg: €{transporter.ratePerKg || 0}/kg</span>
                            </div>
                            {transporter.recentFeedback && transporter.recentFeedback.length > 0 && (
                              <p style={{
                                fontSize: '12px',
                                color: '#718096',
                                fontStyle: 'italic',
                                margin: '8px 0 0 0'
                              }}>
                                "{transporter.recentFeedback[0]}"
                              </p>
                            )}
                          </div>
                          <button
                            style={{ ...styles.button, ...styles.buttonPrimary, marginLeft: '12px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTransporterSelect(transporter);
                            }}
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                    {availableTransporters.length === 0 && (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#718096' }}>
                        No transporters available. Please try again later.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected Transporter Display */}
          {selectedTransporter && (
            <div style={styles.selectedTransporterCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#22543d' }}>{selectedTransporter.fullName}</h4>
                  <p style={{ margin: '0', fontSize: '12px', color: '#22543d' }}>
                    ⭐ {selectedTransporter.averageRating?.toFixed(1) || 'N/A'} ({selectedTransporter.totalRatings || 0} reviews)
                  </p>
                  {estimatedCost && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '600', color: '#38a169' }}>
                      Estimated Cost: €{estimatedCost.toFixed(2)}
                    </p>
                  )}
                </div>
                {!preSelectedTransporter && (
                  <button
                    type="button"
                    style={{ ...styles.button, ...styles.buttonSecondary }}
                    onClick={() => {
                      setSelectedTransporter(null);
                      setEstimatedCost(null);
                      setAssignmentMethod('direct');
                    }}
                  >
                    Change
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Marketplace Assignment Alert */}
          {assignmentMethod === 'marketplace' && !selectedTransporter && (
            <div style={styles.marketplaceAlert}>
              <div style={{ color: '#22543d', fontWeight: '600', marginBottom: '4px' }}>
                📢 Your delivery will be posted to the marketplace
              </div>
              <div style={{ fontSize: '12px', color: '#22543d' }}>
                Available transporters will apply with their pricing. You'll be able to choose the best option.
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.buttonContainer}>
            <button
              onClick={handleSubmit}
              style={{
                ...styles.button,
                ...styles.buttonPrimary,
                opacity: (!selectedTransporter && assignmentMethod === 'direct') ? 0.6 : 1
              }}
              disabled={assignmentMethod === 'direct' && !selectedTransporter}
            >
              {assignmentMethod === 'direct'
                ? (selectedTransporter ? 'Create Delivery' : 'Select Transporter First')
                : 'Post to Marketplace'
              }
            </button>
            <button
              onClick={handleClose}
              style={{ ...styles.button, ...styles.buttonSecondary }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDeliveryModal;