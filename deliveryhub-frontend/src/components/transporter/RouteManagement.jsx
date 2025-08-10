// import React, { useState, useEffect } from 'react';
// import { Calendar, Plus, MapPin } from 'lucide-react';
// import apiClient from '../../services/apiClient';
// import { useAuth } from '../../contexts/AuthContext';

// const RouteManagement = ({ onRoutesChange }) => {
//   const [routes, setRoutes] = useState([]);
//   const [showRouteForm, setShowRouteForm] = useState(false);
//   const [editingRoute, setEditingRoute] = useState(null);
//     const { user } = useAuth();
//   const [routeForm, setRouteForm] = useState({
//     pickupCity: '',
//     dropoffCity: '',
//     travelDate: '',
//     pickupStartDate: '',
//     pickupEndDate: '',
//     notes: ''
//   });

//   // Fetch routes
//   const fetchRoutes = async () => {
//     try {
//       const response = await apiClient.get('/routes/my-routes');
//         setRoutes(response.data);
//         // Notify parent component about routes change
//         if (onRoutesChange) {
//             onRoutesChange(response.data);
//         }
//     } catch (error) {
//       console.error('Error fetching routes:', error);
//     }
//   };

//   // Create route
//     const createRoute = async () => {

        
//     if (!routeForm.pickupCity || !routeForm.dropoffCity || !routeForm.travelDate || 
//         !routeForm.pickupStartDate || !routeForm.pickupEndDate) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     if (new Date(routeForm.pickupEndDate) < new Date(routeForm.pickupStartDate)) {
//       alert('Pickup end date must be after pickup start date');
//       return;
//     }

//     if (new Date(routeForm.travelDate) < new Date(routeForm.pickupEndDate)) {
//       alert('Travel date must be after pickup period');
//       return;
//     }

//     try {
//       const response = await apiClient.post('/routes', routeForm);
//         console.log('✅ Route created successfully:', response.data);
//       setShowRouteForm(false);
//       setRouteForm({
//         pickupCity: '',
//         dropoffCity: '',
//         travelDate: '',
//         pickupStartDate: '',
//         pickupEndDate: '',
//         notes: ''
//       });
//       fetchRoutes();
//     } catch (error) {
//         console.error('Error creating route:', error);

//     }
//   };

//   // Delete route
//   const deleteRoute = async (routeId) => {
//     if (!window.confirm('Are you sure you want to delete this route?')) return;
    
//     try {
//       await apiClient.delete(`/routes/${routeId}`);
//       fetchRoutes();
//     } catch (error) {
//       console.error('Error deleting route:', error);
//     }
//   };

//   // Start editing route
//   const startEditRoute = (route) => {
//     setEditingRoute(route);
//     setRouteForm({
//       pickupCity: route.pickupCity,
//       dropoffCity: route.dropoffCity,
//       travelDate: route.travelDate,
//       pickupStartDate: route.pickupStartDate,
//       pickupEndDate: route.pickupEndDate,
//       notes: route.notes || ''
//     });
//     setShowRouteForm(true);
//   };

//   // Update route
//   const updateRoute = async () => {
//     if (!routeForm.pickupCity || !routeForm.dropoffCity || !routeForm.travelDate || 
//         !routeForm.pickupStartDate || !routeForm.pickupEndDate) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     if (new Date(routeForm.pickupEndDate) < new Date(routeForm.pickupStartDate)) {
//       alert('Pickup end date must be after pickup start date');
//       return;
//     }

//     if (new Date(routeForm.travelDate) < new Date(routeForm.pickupEndDate)) {
//       alert('Travel date must be after pickup period');
//       return;
//     }

//     try {
//       await apiClient.put(`/routes/${editingRoute.id}`, routeForm);
      
//       setShowRouteForm(false);
//       setEditingRoute(null);
//       setRouteForm({
//         pickupCity: '',
//         dropoffCity: '',
//         travelDate: '',
//         pickupStartDate: '',
//         pickupEndDate: '',
//         notes: ''
//       });
//       fetchRoutes();
//     } catch (error) {
//       console.error('Error updating route:', error);
//     }
//   };

//   // Cancel edit
//   const cancelEdit = () => {
//     setShowRouteForm(false);
//     setEditingRoute(null);
//     setRouteForm({
//       pickupCity: '',
//       dropoffCity: '',
//       travelDate: '',
//       pickupStartDate: '',
//       pickupEndDate: '',
//       notes: ''
//     });
//   };

//   // Load routes on mount
//   useEffect(() => {
//     fetchRoutes();
//   }, []);

//   const styles = {
//     card: {
//       backgroundColor: 'white',
//       padding: '24px',
//       borderRadius: '12px',
//       boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
//       border: '1px solid #e2e8f0'
//     },
//     cardTitle: {
//       fontSize: '18px',
//       fontWeight: '600',
//       marginBottom: '16px',
//       color: '#1a202c',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     button: {
//       padding: '10px 16px',
//       borderRadius: '8px',
//       border: 'none',
//       cursor: 'pointer',
//       fontSize: '14px',
//       fontWeight: '500',
//       transition: 'all 0.2s',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     buttonPrimary: {
//       backgroundColor: '#3182ce',
//       color: 'white'
//     },
//     buttonSuccess: {
//       backgroundColor: '#38a169',
//       color: 'white'
//     },
//     buttonSecondary: {
//       backgroundColor: '#e2e8f0',
//       color: '#4a5568'
//     },
//     detailItem: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '4px'
//     },
//     detailLabel: {
//       fontSize: '12px',
//       color: '#718096',
//       fontWeight: '500'
//     },
//     detailValue: {
//       fontSize: '14px',
//       color: '#1a202c',
//       fontWeight: '500'
//     },
//     emptyState: {
//       textAlign: 'center',
//       padding: '48px 20px',
//       color: '#718096'
//     },
//     emptyIcon: {
//       width: '48px',
//       height: '48px',
//       margin: '0 auto 16px',
//       color: '#cbd5e0'
//     }
//   };

//   return (
//     <div style={styles.card}>
//       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
//         <h3 style={styles.cardTitle}>
//           <Calendar size={20} />
//           My Travel Routes
//         </h3>
//         <button
//           style={{ ...styles.button, ...styles.buttonPrimary }}
//           onClick={() => {
//             if (editingRoute) {
//               setEditingRoute(null);
//               setRouteForm({
//                 pickupCity: '',
//                 dropoffCity: '',
//                 travelDate: '',
//                 pickupStartDate: '',
//                 pickupEndDate: '',
//                 notes: ''
//               });
//             }
//             setShowRouteForm(!showRouteForm);
//           }}
//         >
//           <Plus size={16} />
//           Add New Route
//         </button>
//       </div>

//       {/* Route Form */}
//       {showRouteForm && (
//         <div style={{backgroundColor: '#f7fafc', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0'}}>
//           <h4 style={{ marginBottom: '20px', color: '#1a202c' }}>{editingRoute ? 'Edit Travel Route' : 'Add New Travel Route'}</h4>
          
//           <div style={{display: 'grid', gap: '16px'}}>
//             <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
//               <div>
//                 <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
//                   Pickup City *
//                 </label>
//                 <input
//                   type="text"
//                   value={routeForm.pickupCity}
//                   onChange={(e) => setRouteForm({...routeForm, pickupCity: e.target.value})}
//                   placeholder="e.g., Paris, Madrid, Berlin"
//                   style={{
//                     width: '100%',
//                     padding: '12px',
//                     border: '1px solid #e2e8f0',
//                     borderRadius: '8px',
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>
              
//               <div>
//                 <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
//                   Dropoff City *
//                 </label>
//                 <input
//                   type="text"
//                   value={routeForm.dropoffCity}
//                   onChange={(e) => setRouteForm({...routeForm, dropoffCity: e.target.value})}
//                   placeholder="e.g., Casablanca, Rabat, Marrakech"
//                   style={{
//                     width: '100%',
//                     padding: '12px',
//                     border: '1px solid #e2e8f0',
//                     borderRadius: '8px',
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>
//             </div>

//             <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
//               <div>
//                 <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
//                   Travel Date *
//                 </label>
//                 <input
//                   type="date"
//                   value={routeForm.travelDate}
//                   onChange={(e) => setRouteForm({...routeForm, travelDate: e.target.value})}
//                   min={new Date().toISOString().split('T')[0]}
//                   style={{
//                     width: '100%',
//                     padding: '12px',
//                     border: '1px solid #e2e8f0',
//                     borderRadius: '8px',
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>
              
//               <div>
//                 <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
//                   Pickup Start Date *
//                 </label>
//                 <input
//                   type="date"
//                   value={routeForm.pickupStartDate}
//                   onChange={(e) => setRouteForm({...routeForm, pickupStartDate: e.target.value})}
//                   min={new Date().toISOString().split('T')[0]}
//                   style={{
//                     width: '100%',
//                     padding: '12px',
//                     border: '1px solid #e2e8f0',
//                     borderRadius: '8px',
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>
              
//               <div>
//                 <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
//                   Pickup End Date *
//                 </label>
//                 <input
//                   type="date"
//                   value={routeForm.pickupEndDate}
//                   onChange={(e) => setRouteForm({...routeForm, pickupEndDate: e.target.value})}
//                   min={routeForm.pickupStartDate || new Date().toISOString().split('T')[0]}
//                   style={{
//                     width: '100%',
//                     padding: '12px',
//                     border: '1px solid #e2e8f0',
//                     borderRadius: '8px',
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>
//             </div>

//             <div>
//               <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
//                 Notes (Optional)
//               </label>
//               <textarea
//                 value={routeForm.notes}
//                 onChange={(e) => setRouteForm({...routeForm, notes: e.target.value})}
//                 placeholder="Any additional information about this route..."
//                 style={{
//                   width: '100%',
//                   padding: '12px',
//                   border: '1px solid #e2e8f0',
//                   borderRadius: '8px',
//                   fontSize: '14px',
//                   minHeight: '80px',
//                   resize: 'vertical'
//                 }}
//               />
//             </div>
//           </div>

//           <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
//             <button
//               style={{...styles.button, ...styles.buttonSuccess}}
//               onClick={editingRoute ? updateRoute : createRoute}
//             >
//               {editingRoute ? 'Update Route' : 'Create Route'}
//             </button>
//             <button
//               style={{...styles.button, ...styles.buttonSecondary}}
//               onClick={editingRoute ? cancelEdit : () => {
//                 setShowRouteForm(false);
//                 setRouteForm({
//                   pickupCity: '',
//                   dropoffCity: '',
//                   travelDate: '',
//                   pickupStartDate: '',
//                   pickupEndDate: '',
//                   notes: ''
//                 });
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Routes List */}
//       {routes.length > 0 ? (
//         <div style={{display: 'grid', gap: '16px'}}>
//           {routes.map(route => {
//             const isUpcoming = new Date(route.travelDate) > new Date();
//             const isPickupActive = new Date() >= new Date(route.pickupStartDate) && new Date() <= new Date(route.pickupEndDate);
            
//             return (
//               <div
//                 key={route.id}
//                 style={{
//                   backgroundColor: isPickupActive ? '#f0fff4' : isUpcoming ? 'white' : '#f7fafc',
//                   border: `1px solid ${isPickupActive ? '#68d391' : isUpcoming ? '#e2e8f0' : '#cbd5e0'}`,
//                   borderRadius: '12px',
//                   padding: '20px'
//                 }}
//               >
//                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
//                   <div style={{flex: 1}}>
//                     <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
//                       <MapPin size={16} style={{color: '#3182ce'}} />
//                       <span style={{fontSize: '18px', fontWeight: '600', color: '#1a202c'}}>
//                         {route.pickupCity} → {route.dropoffCity}
//                       </span>
//                       {isPickupActive && (
//                         <span style={{
//                           backgroundColor: '#38a169',
//                           color: 'white',
//                           padding: '2px 8px',
//                           borderRadius: '12px',
//                           fontSize: '10px',
//                           fontWeight: '600'
//                         }}>
//                           ACCEPTING PICKUPS
//                         </span>
//                       )}
//                     </div>
                    
//                     <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
//                       <div style={styles.detailItem}>
//                         <span style={styles.detailLabel}>Travel Date</span>
//                         <span style={styles.detailValue}>
//                           <Calendar size={14} style={{display: 'inline', marginRight: '4px'}} />
//                           {new Date(route.travelDate).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div style={styles.detailItem}>
//                         <span style={styles.detailLabel}>Pickup Period</span>
//                         <span style={styles.detailValue}>
//                           {new Date(route.pickupStartDate).toLocaleDateString()} - {new Date(route.pickupEndDate).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div style={styles.detailItem}>
//                         <span style={styles.detailLabel}>Status</span>
//                         <span style={{
//                           ...styles.detailValue,
//                           color: isPickupActive ? '#38a169' : isUpcoming ? '#3182ce' : '#718096'
//                         }}>
//                           {isPickupActive ? 'Active (Accepting)' : isUpcoming ? 'Upcoming' : 'Completed'}
//                         </span>
//                       </div>
//                     </div>

//                     {route.notes && (
//                       <div style={{marginTop: '12px'}}>
//                         <span style={styles.detailLabel}>Notes:</span>
//                         <p style={{...styles.detailValue, marginTop: '4px', fontStyle: 'italic'}}>{route.notes}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div style={{display: 'flex', gap: '8px', marginLeft: '16px'}}>
//                     {isUpcoming && (
//                       <button
//                         style={{ ...styles.button, ...styles.buttonSecondary }}
//                         onClick={() => startEditRoute(route)}
//                       >
//                         Edit
//                       </button>
//                     )}
//                     <button
//                       style={{...styles.button, backgroundColor: '#e53e3e', color: 'white'}}
//                       onClick={() => deleteRoute(route.id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div style={styles.emptyState}>
//           <Calendar style={styles.emptyIcon} />
//           <h3>No routes scheduled</h3>
//           <p>Add your travel routes to let customers know when you're available for pickups!</p>
//           <button
//             style={{...styles.button, ...styles.buttonPrimary, marginTop: '16px'}}
//             onClick={() => setShowRouteForm(true)}
//           >
//             <Plus size={16} />
//             Add Your First Route
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RouteManagement;


import React, { useState, useEffect } from 'react';
import { Calendar, Plus, MapPin } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';

const RouteManagement = ({ onRoutesChange }) => {
  const [routes, setRoutes] = useState([]);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const { user } = useAuth();
  const [routeForm, setRouteForm] = useState({
    pickupCity: '',
    dropoffCity: '',
    travelDate: '',
    pickupStartDate: '',
    pickupEndDate: '',
    notes: ''
  });

  // Character limit constant - adjust this based on your backend @Size annotation
  const MAX_NOTES_LENGTH = 2000;

  // Fetch routes
  const fetchRoutes = async () => {
    try {
      const response = await apiClient.get('/routes/my-routes');
      setRoutes(response.data);
      // Notify parent component about routes change
      if (onRoutesChange) {
        onRoutesChange(response.data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = [];
    
    if (!routeForm.pickupCity || !routeForm.dropoffCity || !routeForm.travelDate || 
        !routeForm.pickupStartDate || !routeForm.pickupEndDate) {
      errors.push('Please fill in all required fields');
    }

    if (routeForm.notes && routeForm.notes.length > MAX_NOTES_LENGTH) {
      errors.push(`Notes cannot exceed ${MAX_NOTES_LENGTH} characters`);
    }

    if (new Date(routeForm.pickupEndDate) < new Date(routeForm.pickupStartDate)) {
      errors.push('Pickup end date must be after pickup start date');
    }

    if (new Date(routeForm.travelDate) < new Date(routeForm.pickupEndDate)) {
      errors.push('Travel date must be after pickup period');
    }

    return errors;
  };

  // Create route
  const createRoute = async () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    try {
      const response = await apiClient.post('/routes', routeForm);
      console.log('✅ Route created successfully:', response.data);
      setShowRouteForm(false);
      setRouteForm({
        pickupCity: '',
        dropoffCity: '',
        travelDate: '',
        pickupStartDate: '',
        pickupEndDate: '',
        notes: ''
      });
      fetchRoutes();
    } catch (error) {
      console.error('Error creating route:', error);
    }
  };

  // Delete route
  const deleteRoute = async (routeId) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    
    try {
      await apiClient.delete(`/routes/${routeId}`);
      fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  // Start editing route
  const startEditRoute = (route) => {
    setEditingRoute(route);
    setRouteForm({
      pickupCity: route.pickupCity,
      dropoffCity: route.dropoffCity,
      travelDate: route.travelDate,
      pickupStartDate: route.pickupStartDate,
      pickupEndDate: route.pickupEndDate,
      notes: route.notes || ''
    });
    setShowRouteForm(true);
  };

  // Update route
  const updateRoute = async () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    try {
      await apiClient.put(`/routes/${editingRoute.id}`, routeForm);
      
      setShowRouteForm(false);
      setEditingRoute(null);
      setRouteForm({
        pickupCity: '',
        dropoffCity: '',
        travelDate: '',
        pickupStartDate: '',
        pickupEndDate: '',
        notes: ''
      });
      fetchRoutes();
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setShowRouteForm(false);
    setEditingRoute(null);
    setRouteForm({
      pickupCity: '',
      dropoffCity: '',
      travelDate: '',
      pickupStartDate: '',
      pickupEndDate: '',
      notes: ''
    });
  };

  // Load routes on mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  // Check if form is invalid (for button styling)
  const isFormInvalid = routeForm.notes && routeForm.notes.length > MAX_NOTES_LENGTH;

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
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 20px',
      color: '#718096'
    },
    emptyIcon: {
      width: '48px',
      height: '48px',
      margin: '0 auto 16px',
      color: '#cbd5e0'
    }
  };

  return (
    <div style={styles.card}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h3 style={styles.cardTitle}>
          <Calendar size={20} />
          My Travel Routes
        </h3>
        <button
          style={{ ...styles.button, ...styles.buttonPrimary }}
          onClick={() => {
            if (editingRoute) {
              setEditingRoute(null);
              setRouteForm({
                pickupCity: '',
                dropoffCity: '',
                travelDate: '',
                pickupStartDate: '',
                pickupEndDate: '',
                notes: ''
              });
            }
            setShowRouteForm(!showRouteForm);
          }}
        >
          <Plus size={16} />
          Add New Route
        </button>
      </div>

      {/* Route Form */}
      {showRouteForm && (
        <div style={{backgroundColor: '#f7fafc', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0'}}>
          <h4 style={{ marginBottom: '20px', color: '#1a202c' }}>{editingRoute ? 'Edit Travel Route' : 'Add New Travel Route'}</h4>
          
          <div style={{display: 'grid', gap: '16px'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
                  Pickup City *
                </label>
                <input
                  type="text"
                  value={routeForm.pickupCity}
                  onChange={(e) => setRouteForm({...routeForm, pickupCity: e.target.value})}
                  placeholder="e.g., Paris, Madrid, Berlin"
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
                  Dropoff City *
                </label>
                <input
                  type="text"
                  value={routeForm.dropoffCity}
                  onChange={(e) => setRouteForm({...routeForm, dropoffCity: e.target.value})}
                  placeholder="e.g., Casablanca, Rabat, Marrakech"
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

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
                  Travel Date *
                </label>
                <input
                  type="date"
                  value={routeForm.travelDate}
                  onChange={(e) => setRouteForm({...routeForm, travelDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
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
                  Pickup Start Date *
                </label>
                <input
                  type="date"
                  value={routeForm.pickupStartDate}
                  onChange={(e) => setRouteForm({...routeForm, pickupStartDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
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
                  Pickup End Date *
                </label>
                <input
                  type="date"
                  value={routeForm.pickupEndDate}
                  onChange={(e) => setRouteForm({...routeForm, pickupEndDate: e.target.value})}
                  min={routeForm.pickupStartDate || new Date().toISOString().split('T')[0]}
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

            {/* Enhanced Notes Section with Character Count */}
            <div>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#4a5568'}}>
                Notes (Optional)
              </label>
              <textarea
                value={routeForm.notes}
                onChange={(e) => setRouteForm({...routeForm, notes: e.target.value})}
                placeholder="Any additional information about this route..."
                maxLength={MAX_NOTES_LENGTH} // Browser-level limit
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${isFormInvalid ? '#e53e3e' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
              
              {/* Character count display */}
              <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '4px',
                fontSize: '12px'
              }}>
                <span style={{
                  color: isFormInvalid ? '#e53e3e' : '#718096'
                }}>
                  {routeForm.notes ? routeForm.notes.length : 0} / {MAX_NOTES_LENGTH} characters
                </span>
                
                {isFormInvalid && (
                  <span style={{color: '#e53e3e', fontWeight: '500'}}>
                    ⚠️ Text too long
                  </span>
                )}
              </div>
              
              {/* Visual warning for excess characters */}
              {isFormInvalid && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#fed7d7',
                  border: '1px solid #fc8181',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#742a2a'
                }}>
                  Please reduce your notes by {routeForm.notes.length - MAX_NOTES_LENGTH} characters to continue.
                </div>
              )}
            </div>
          </div>

          <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
            <button
              style={{
                ...styles.button, 
                ...styles.buttonSuccess,
                opacity: isFormInvalid ? 0.5 : 1,
                cursor: isFormInvalid ? 'not-allowed' : 'pointer'
              }}
              onClick={editingRoute ? updateRoute : createRoute}
              disabled={isFormInvalid}
            >
              {editingRoute ? 'Update Route' : 'Create Route'}
            </button>
            <button
              style={{...styles.button, ...styles.buttonSecondary}}
              onClick={editingRoute ? cancelEdit : () => {
                setShowRouteForm(false);
                setRouteForm({
                  pickupCity: '',
                  dropoffCity: '',
                  travelDate: '',
                  pickupStartDate: '',
                  pickupEndDate: '',
                  notes: ''
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Routes List */}
      {routes.length > 0 ? (
        <div style={{display: 'grid', gap: '16px'}}>
          {routes.map(route => {
            const isUpcoming = new Date(route.travelDate) > new Date();
            const isPickupActive = new Date() >= new Date(route.pickupStartDate) && new Date() <= new Date(route.pickupEndDate);
            
            return (
              <div
                key={route.id}
                style={{
                  backgroundColor: isPickupActive ? '#f0fff4' : isUpcoming ? 'white' : '#f7fafc',
                  border: `1px solid ${isPickupActive ? '#68d391' : isUpcoming ? '#e2e8f0' : '#cbd5e0'}`,
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                      <MapPin size={16} style={{color: '#3182ce'}} />
                      <span style={{fontSize: '18px', fontWeight: '600', color: '#1a202c'}}>
                        {route.pickupCity} → {route.dropoffCity}
                      </span>
                      {isPickupActive && (
                        <span style={{
                          backgroundColor: '#38a169',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600'
                        }}>
                          ACCEPTING PICKUPS
                        </span>
                      )}
                    </div>
                    
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Travel Date</span>
                        <span style={styles.detailValue}>
                          <Calendar size={14} style={{display: 'inline', marginRight: '4px'}} />
                          {new Date(route.travelDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Pickup Period</span>
                        <span style={styles.detailValue}>
                          {new Date(route.pickupStartDate).toLocaleDateString()} - {new Date(route.pickupEndDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Status</span>
                        <span style={{
                          ...styles.detailValue,
                          color: isPickupActive ? '#38a169' : isUpcoming ? '#3182ce' : '#718096'
                        }}>
                          {isPickupActive ? 'Active (Accepting)' : isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                      </div>
                    </div>

                    {route.notes && (
                      <div style={{marginTop: '12px'}}>
                        <span style={styles.detailLabel}>Notes:</span>
                        <p style={{...styles.detailValue, marginTop: '4px', fontStyle: 'italic'}}>{route.notes}</p>
                      </div>
                    )}
                  </div>

                  <div style={{display: 'flex', gap: '8px', marginLeft: '16px'}}>
                    {isUpcoming && (
                      <button
                        style={{ ...styles.button, ...styles.buttonSecondary }}
                        onClick={() => startEditRoute(route)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      style={{...styles.button, backgroundColor: '#e53e3e', color: 'white'}}
                      onClick={() => deleteRoute(route.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <Calendar style={styles.emptyIcon} />
          <h3>No routes scheduled</h3>
          <p>Add your travel routes to let customers know when you're available for pickups!</p>
          <button
            style={{...styles.button, ...styles.buttonPrimary, marginTop: '16px'}}
            onClick={() => setShowRouteForm(true)}
          >
            <Plus size={16} />
            Add Your First Route
          </button>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;