import React, { useState, useEffect } from 'react';
import { Euro } from 'lucide-react';
import apiClient from '../../services/apiClient';

const PricingConfiguration = () => {
  const [pricingConfig, setPricingConfig] = useState({
    ratePerKg: '',
    fixedPriceUnderThreshold: '',
    weightThreshold: '',
    currency: 'EUR'
  });
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [pricingExists, setPricingExists] = useState(false);

  // Calculate estimated earnings based on weight
  const calculateEstimatedEarnings = (weightKg) => {
    if (!pricingConfig.ratePerKg || !weightKg) return 0;
    
    const weight = parseFloat(weightKg);
    const threshold = parseFloat(pricingConfig.weightThreshold) || 10;
    const ratePerKg = parseFloat(pricingConfig.ratePerKg);
    const fixedPrice = parseFloat(pricingConfig.fixedPriceUnderThreshold);
    
    if (weight <= threshold && fixedPrice) {
      return fixedPrice;
    }
    return weight * ratePerKg;
  };

  // Fetch pricing configuration
  const fetchPricingConfig = async () => {
    try {
      const response = await apiClient.get('/pricing/my-config');
      setPricingConfig(response.data);
      setPricingExists(true);
    } catch (error) {
      console.error('Error fetching pricing config:', error);
      if (error.response?.status === 404) {
        setPricingExists(false);
      } else {
        setPricingExists(false);
      }
    }
  };

  // Save pricing configuration
  const savePricingConfig = async () => {
    try {
      const pricingData = {
        ratePerKg: parseFloat(pricingConfig.ratePerKg),
        fixedPriceUnderThreshold: parseFloat(pricingConfig.fixedPriceUnderThreshold),
        weightThreshold: parseFloat(pricingConfig.weightThreshold),
        currency: pricingConfig.currency
      };

      if (pricingExists) {
        await apiClient.put('/pricing/config', pricingData);
      } else {
        await apiClient.post('/pricing/config', pricingData);
      }

      setShowPricingForm(false);
      setPricingExists(true);
      await fetchPricingConfig();
    } catch (error) {
      console.error('Error saving pricing config:', error);
    }
  };

  // Load pricing config on mount
  useEffect(() => {
    fetchPricingConfig();
  }, []);

  const styles = {
    card: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1a202c',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    button: {
      padding: '10px 16px',
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
    buttonSecondary: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    detailLabel: {
      fontSize: '12px',
      color: '#718096',
      fontWeight: '500'
    },
    detailValue: {
      fontSize: '14px',
      color: '#1a202c',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.card}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h3 style={styles.cardTitle}>
          <Euro size={20} />
          Pricing Configuration
        </h3>
        <button
          style={{...styles.button, ...styles.buttonPrimary}}
          onClick={() => setShowPricingForm(!showPricingForm)}
        >
          {pricingExists ? 'Edit Pricing' : 'Set Up Pricing'}
        </button>
      </div>

      {/* Current Pricing Display */}
      {pricingExists && !showPricingForm ? (
        <div style={{backgroundColor: '#f7fafc', padding: '24px', borderRadius: '12px', marginBottom: '24px'}}>
          <h4 style={{marginBottom: '16px', color: '#1a202c'}}>Current Pricing Structure</h4>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Rate per Kg</span>
              <span style={{...styles.detailValue, fontSize: '18px', color: '#3182ce'}}>
                €{pricingConfig.ratePerKg}/kg
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Fixed Price (Under {pricingConfig.weightThreshold}kg)</span>
              <span style={{...styles.detailValue, fontSize: '18px', color: '#3182ce'}}>
                €{pricingConfig.fixedPriceUnderThreshold}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Rate Structure</span>
              <span style={{...styles.detailValue, fontSize: '14px'}}>
                Under {pricingConfig.weightThreshold}kg: €{pricingConfig.fixedPriceUnderThreshold} fixed<br/>
                {pricingConfig.weightThreshold}kg+: €{pricingConfig.ratePerKg}/kg
              </span>
            </div>
          </div>

          {/* Pricing Examples */}
          <div style={{marginTop: '24px'}}>
            <h5 style={{marginBottom: '12px', color: '#4a5568'}}>Pricing Examples:</h5>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px'}}>
              {[2, 5, 9, 10, 15, 25].map(weight => (
                <div key={weight} style={{
                  backgroundColor: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{fontSize: '14px', color: '#718096'}}>{weight}kg</div>
                  <div style={{fontSize: '16px', fontWeight: '600', color: '#38a169'}}>
                    €{calculateEstimatedEarnings(weight).toFixed(2)}
                  </div>
                  <div style={{fontSize: '10px', color: '#718096'}}>
                    {weight < parseFloat(pricingConfig.weightThreshold) ? 'Fixed Rate' : 'Per Kg Rate'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : !pricingExists ? (
        /* Warning for no pricing configured */
        <div style={{
          backgroundColor: '#fef5e7',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #f6e05e'
        }}>
          <h4 style={{color: '#744210', marginBottom: '8px'}}>⚠️ Pricing Not Configured</h4>
          <p style={{color: '#744210', marginBottom: '16px'}}>
            You need to set up your pricing structure to start earning from deliveries. 
            Configure your rates below to begin accepting paid jobs.
          </p>
          <button
            style={{...styles.button, ...styles.buttonWarning}}
            onClick={() => setShowPricingForm(true)}
          >
            Set Up Pricing Now
          </button>
        </div>
      ) : null}

      {/* Pricing Form */}
      {showPricingForm && (
        <div style={{backgroundColor: 'white', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px'}}>
          <h4 style={{marginBottom: '20px', color: '#1a202c'}}>
            {pricingExists ? 'Update' : 'Configure'} Your Pricing
          </h4>
          
          <div style={{display: 'grid', gap: '16px'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
                  Rate per Kg (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={pricingConfig.ratePerKg}
                  onChange={(e) => setPricingConfig({...pricingConfig, ratePerKg: e.target.value})}
                  placeholder="e.g., 2.50"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
                  Weight Threshold (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={pricingConfig.weightThreshold}
                  onChange={(e) => setPricingConfig({...pricingConfig, weightThreshold: e.target.value})}
                  placeholder="e.g., 10"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
                Fixed Price for Small Items (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pricingConfig.fixedPriceUnderThreshold}
                onChange={(e) => setPricingConfig({...pricingConfig, fixedPriceUnderThreshold: e.target.value})}
                placeholder="e.g., 15.00"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <p style={{fontSize: '12px', color: '#718096', marginTop: '4px'}}>
                Fixed price for items under {pricingConfig.weightThreshold || 'X'}kg (not including {pricingConfig.weightThreshold || 'X'}kg)
              </p>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
                Currency
              </label>
              <select
                value={pricingConfig.currency}
                onChange={(e) => setPricingConfig({...pricingConfig, currency: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="MAD">MAD (DH)</option>
              </select>
            </div>
          </div>

          {/* Live Preview */}
          {pricingConfig.ratePerKg && pricingConfig.fixedPriceUnderThreshold && pricingConfig.weightThreshold && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#f0fff4',
              border: '1px solid #9ae6b4',
              borderRadius: '8px'
            }}>
              <h5 style={{color: '#22543d', marginBottom: '8px'}}>Live Preview (Threshold: {pricingConfig.weightThreshold}kg)</h5>
              <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                {[1, 5, 9, 10, 15, 20].map(weight => (
                  <div key={weight} style={{textAlign: 'center'}}>
                    <div style={{fontSize: '12px', color: '#22543d'}}>{weight}kg</div>
                    <div style={{fontSize: '16px', fontWeight: '600', color: '#38a169'}}>
                      €{calculateEstimatedEarnings(weight).toFixed(2)}
                    </div>
                    <div style={{fontSize: '10px', color: '#718096'}}>
                      {weight < parseFloat(pricingConfig.weightThreshold) ? 'Fixed' : 'Per kg'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
            <button
              style={{...styles.button, ...styles.buttonSuccess, flex: 1}}
              onClick={savePricingConfig}
              disabled={!pricingConfig.ratePerKg || !pricingConfig.fixedPriceUnderThreshold || !pricingConfig.weightThreshold}
            >
              {pricingExists ? 'Update Pricing' : 'Save Pricing'}
            </button>
            <button
              style={{...styles.button, ...styles.buttonSecondary}}
              onClick={() => setShowPricingForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingConfiguration;