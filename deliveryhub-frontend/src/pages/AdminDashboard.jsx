import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Users, Package, Clock, MapPin, Truck, AlertCircle, XCircle } from 'lucide-react';
import apiClient from '../services/apiClient';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [statusPercentages, setStatusPercentages] = useState({});
  const [topCities, setTopCities] = useState({ pickup: [], dropoff: [] });
  const [topTransporters, setTopTransporters] = useState([]);
  const [topRoutes, setTopRoutes] = useState([]);
  const [pendingTransporters, setPendingTransporters] = useState([]);
  const [oldPendingDeliveries, setOldPendingDeliveries] = useState([]);
  const [cancelledReasons, setCancelledReasons] = useState({});
  const [loading, setLoading] = useState(true);

  //const API_BASE = 'http://localhost:8080/api/admin';

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
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
    refreshButton: {
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 20px'
    },
    grid: {
      display: 'grid',
      gap: '24px'
    },
    grid4: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      marginBottom: '32px'
    },
    grid2: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      marginBottom: '32px'
    },
    grid3: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      marginBottom: '32px'
    },
    card: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0'
    },
    metricCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center'
    },
    metricIcon: {
      width: '32px',
      height: '32px',
      marginRight: '16px'
    },
    metricLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#718096',
      margin: 0
    },
    metricValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1a202c',
      margin: '4px 0 0 0'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1a202c'
    },
    listItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      marginBottom: '8px'
    },
    listItemLeft: {
      display: 'flex',
      alignItems: 'center'
    },
    listItemBadge: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      marginRight: '12px'
    },
    listItemText: {
      fontSize: '14px',
      fontWeight: '500'
    },
    listItemSubtext: {
      fontSize: '12px',
      color: '#718096'
    },
    pendingCard: {
      backgroundColor: '#fef5e7',
      border: '1px solid #f6e05e',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '8px'
    },
    urgentCard: {
      backgroundColor: '#fed7d7',
      border: '1px solid #fc8181',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '8px'
    },
    button: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    buttonGreen: {
      backgroundColor: '#38a169',
      color: 'white'
    },
    buttonRed: {
      backgroundColor: '#e53e3e',
      color: 'white'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      flexDirection: 'column'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #3182ce',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    loadingText: {
      marginTop: '16px',
      color: '#718096'
    },
    emptyState: {
      textAlign: 'center',
      padding: '32px',
      color: '#718096'
    }
  };

  const fetchData = async () => {
    try {
      const [
        dashboardRes,
        dailyStatsRes,
        statusRes,
        pickupCitiesRes,
        dropoffCitiesRes,
        transportersRes,
        routesRes,
        pendingTransportersRes,
        oldPendingRes,
        cancelledReasonsRes
      ] = await Promise.all([
        apiClient.get('/admin/dashboard'),
        apiClient.get('/admin/dashboard/daily-stats'),
        apiClient.get('/admin/dashboard/status-percentages'),
        apiClient.get('/admin/dashboard/top-pickup-cities'),
        apiClient.get('/admin/dashboard/top-dropoff-cities'),
        apiClient.get('/admin/dashboard/top-transporters'),
        apiClient.get('/admin/dashboard/top-routes'),
        apiClient.get('/admin/transporters/pending'),
        apiClient.get('/admin/dashboard/old-pending?threshold=5'),
        apiClient.get('/admin/dashboard/cancelled-reasons')
      ]);

      setDashboardData(dashboardRes.data);
      setDailyStats(dailyStatsRes.data);
      setStatusPercentages(statusRes.data);
      setTopCities({
        pickup: pickupCitiesRes.data,
        dropoff: dropoffCitiesRes.data
      });
      setTopTransporters(transportersRes.data);
      setTopRoutes(routesRes.data);
      setPendingTransporters(pendingTransportersRes.data);
      setOldPendingDeliveries(oldPendingRes.data);
      setCancelledReasons(cancelledReasonsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyTransporter = async (id) => {
    try {
      await apiClient.put(`/admin/transporters/${id}/verify`);
      fetchData();
    } catch (error) {
      console.error('Error verifying transporter:', error);
    }
  };

  const cancelDelivery = async (deliveryId, reason) => {
    try {
      await apiClient.post('/admin/dashboard/cancel', { 
        deliveryId, 
        reason 
      });
      fetchData();
    } catch (error) {
      console.error('Error cancelling delivery:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading admin dashboard...</p>
      </div>
    );
  }

  const COLORS = ['#3182ce', '#38a169', '#d69e2e', '#e53e3e', '#805ad5'];

  const statusData = Object.entries(statusPercentages).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
    count: Math.round((value / 100) * (dashboardData?.totalDeliveries || 0))
  }));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.headerTitle}>Admin Dashboard</h1>
            <p style={styles.headerSubtitle}>Delivery Hub Management System</p>
          </div>
          <button
            style={styles.refreshButton}
            onClick={fetchData}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
          >
            Refresh Data
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Key Metrics */}
        <div style={{...styles.grid, ...styles.grid4}}>
          <div style={styles.metricCard}>
            <Package style={{...styles.metricIcon, color: '#3182ce'}} />
            <div>
              <p style={styles.metricLabel}>Total Deliveries</p>
              <p style={styles.metricValue}>{dashboardData?.totalDeliveries || 0}</p>
            </div>
          </div>
          <div style={styles.metricCard}>
            <Users style={{...styles.metricIcon, color: '#38a169'}} />
            <div>
              <p style={styles.metricLabel}>Total Customers</p>
              <p style={styles.metricValue}>{dashboardData?.totalCustomers || 0}</p>
            </div>
          </div>
          <div style={styles.metricCard}>
            <Truck style={{...styles.metricIcon, color: '#805ad5'}} />
            <div>
              <p style={styles.metricLabel}>Total Transporters</p>
              <p style={styles.metricValue}>{dashboardData?.totalTransporters || 0}</p>
            </div>
          </div>
          <div style={styles.metricCard}>
            <Clock style={{...styles.metricIcon, color: '#d69e2e'}} />
            <div>
              <p style={styles.metricLabel}>Avg Completion</p>
              <p style={styles.metricValue}>{dashboardData?.avgCompletionDays || 0} days</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{...styles.grid, ...styles.grid2}}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Daily Delivery Trends</h3>
            <div style={{height: '300px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="deliveryCount" stroke="#3182ce" fill="#3182ce" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Delivery Status Distribution</h3>
            <div style={{height: '300px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div style={{...styles.grid, ...styles.grid3}}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Top Transporters</h3>
            {topTransporters.slice(0, 5).map((transporter, index) => (
              <div key={index} style={styles.listItem}>
                <div style={styles.listItemLeft}>
                  <div style={{...styles.listItemBadge, backgroundColor: '#e6fffa', color: '#38a169'}}>
                    {index + 1}
                  </div>
                  <span style={styles.listItemText}>{transporter.name}</span>
                </div>
                <span style={styles.listItemSubtext}>{transporter.completedDeliveries} deliveries</span>
              </div>
            ))}
            {topTransporters.length === 0 && (
              <div style={styles.emptyState}>No transporter data available</div>
            )}
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Top Pickup Cities</h3>
            {topCities.pickup.slice(0, 5).map((city, index) => (
              <div key={index} style={styles.listItem}>
                <div style={styles.listItemLeft}>
                  <MapPin style={{width: '16px', height: '16px', color: '#38a169', marginRight: '12px'}} />
                  <span style={styles.listItemText}>{city.cityName}</span>
                </div>
                <span style={styles.listItemSubtext}>{city.count} pickups</span>
              </div>
            ))}
            {topCities.pickup.length === 0 && (
              <div style={styles.emptyState}>No pickup data available</div>
            )}
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Top Routes</h3>
            {topRoutes.slice(0, 5).map((route, index) => (
              <div key={index} style={styles.listItem}>
                <div style={styles.listItemLeft}>
                  <div style={{...styles.listItemBadge, backgroundColor: '#f0e6ff', color: '#805ad5'}}>
                    {index + 1}
                  </div>
                  <span style={styles.listItemText}>{route.routeName}</span>
                </div>
                <span style={styles.listItemSubtext}>{route.deliveryCount} deliveries</span>
              </div>
            ))}
            {topRoutes.length === 0 && (
              <div style={styles.emptyState}>No route data available</div>
            )}
          </div>
        </div>

        {/* Management Sections */}
        <div style={{...styles.grid, ...styles.grid2}}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              <AlertCircle style={{width: '20px', height: '20px', color: '#d69e2e', marginRight: '8px', display: 'inline'}} />
              Pending Transporter Verifications ({pendingTransporters.length})
            </h3>
            <div style={{maxHeight: '300px', overflowY: 'auto'}}>
              {pendingTransporters.map((transporter) => (
                <div key={transporter.id} style={styles.pendingCard}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <p style={{fontWeight: '600', margin: '0 0 4px 0'}}>{transporter.name}</p>
                      <p style={styles.listItemSubtext}>{transporter.email}</p>
                      <p style={styles.listItemSubtext}>Phone: {transporter.phone}</p>
                    </div>
                    <button
                      style={{...styles.button, ...styles.buttonGreen}}
                      onClick={() => verifyTransporter(transporter.id)}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#2f855a'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#38a169'}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ))}
              {pendingTransporters.length === 0 && (
                <div style={styles.emptyState}>No pending verifications</div>
              )}
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              <XCircle style={{width: '20px', height: '20px', color: '#e53e3e', marginRight: '8px', display: 'inline'}} />
              Old Pending Deliveries ({oldPendingDeliveries.length})
            </h3>
            <div style={{maxHeight: '300px', overflowY: 'auto'}}>
              {oldPendingDeliveries.map((delivery) => (
                <div key={delivery.id} style={styles.urgentCard}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <p style={{fontWeight: '600', margin: '0 0 4px 0'}}>Delivery #{delivery.id}</p>
                      <p style={styles.listItemSubtext}>{delivery.ageInDays} days old</p>
                      <p style={styles.listItemSubtext}>From: {delivery.pickupCity}</p>
                    </div>
                    <button
                      style={{...styles.button, ...styles.buttonRed}}
                      onClick={() => cancelDelivery(delivery.id, 'Too old - system cancelled')}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#c53030'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#e53e3e'}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
              {oldPendingDeliveries.length === 0 && (
                <div style={styles.emptyState}>No old pending deliveries</div>
              )}
            </div>
          </div>
        </div>

        {/* Cancelled Deliveries Statistics */}
        {Object.keys(cancelledReasons).length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Cancellation Reasons</h3>
            <div style={{...styles.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
              {Object.entries(cancelledReasons).map(([reason, count]) => (
                <div key={reason} style={{...styles.listItem, flexDirection: 'column', alignItems: 'flex-start'}}>
                  <p style={{fontWeight: '600', margin: '0 0 4px 0'}}>{reason}</p>
                  <p style={{fontSize: '20px', fontWeight: 'bold', color: '#e53e3e', margin: 0}}>{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
