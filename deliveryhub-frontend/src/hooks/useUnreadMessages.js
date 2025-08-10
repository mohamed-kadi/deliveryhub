// // src/hooks/useUnreadMessages.js
// import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import apiClient from '../services/apiClient';

// const useUnreadMessages = () => {
//   const [unreadCounts, setUnreadCounts] = useState({}); // {deliveryId: count}
//   const [totalUnread, setTotalUnread] = useState(0);
//   const { user } = useAuth();

//   // Fetch unread counts for all user's deliveries
//   const fetchUnreadCounts = useCallback(async () => {
//     if (!user?.email) return;

//     try {
//       const response = await apiClient.get('/chat/unread-counts');
//       const counts = response.data || {};

//       setUnreadCounts(counts);
      
//       // Calculate total unread
//       const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
//       setTotalUnread(total);
      
//     } catch (error) {
//       console.error('Error fetching unread counts:', error);
//       setUnreadCounts({});
//       setTotalUnread(0);
//     }
//   }, [user?.email]);

//   // Get unread count for specific delivery
//   const getUnreadCount = useCallback((deliveryId) => {
//     return unreadCounts[deliveryId] || 0;
//   }, [unreadCounts]);

//   // Mark messages as read for a specific delivery
//   const markDeliveryAsRead = useCallback((deliveryId) => {
//     setUnreadCounts(prev => ({
//       ...prev,
//       [deliveryId]: 0
//     }));
    
//     // Recalculate total
//     setTotalUnread(prev => {
//       const currentCount = unreadCounts[deliveryId] || 0;
//       return Math.max(0, prev - currentCount);
//     });
    
//     // Call backend to mark as read
//     if (deliveryId) {
//       apiClient.post(`/chat/delivery/${deliveryId}/mark-all-read`)
//         .catch(error => console.error('Error marking messages as read:', error));
//     }
//   }, [unreadCounts]);

//   // Add new message (increment unread count)
//   const handleNewMessage = useCallback((message) => {
//     const deliveryId = message.matchId;
    
//     // Only increment if message is from someone else
//     if (message.senderName !== user?.email && message.senderName !== user?.fullName) {
//       setUnreadCounts(prev => ({
//         ...prev,
//         [deliveryId]: (prev[deliveryId] || 0) + 1
//       }));
      
//       setTotalUnread(prev => prev + 1);
//     }
//   }, [user]);

//   // Decrement unread count when message is marked as read
//   const handleMessageRead = useCallback((deliveryId) => {
//     setUnreadCounts(prev => ({
//       ...prev,
//       [deliveryId]: Math.max(0, (prev[deliveryId] || 0) - 1)
//     }));
    
//     setTotalUnread(prev => Math.max(0, prev - 1));
//   }, []);

//   // Initialize unread counts when component mounts
//   useEffect(() => {
//     fetchUnreadCounts();
//   }, [fetchUnreadCounts]);

//   // Refresh unread counts periodically (every 30 seconds)
//   useEffect(() => {
//     const interval = setInterval(fetchUnreadCounts, 30000);
//     return () => clearInterval(interval);
//   }, [fetchUnreadCounts]);

//   return {
//     unreadCounts,
//     totalUnread,
//     getUnreadCount,
//     markDeliveryAsRead,
//     handleNewMessage,
//     handleMessageRead,
//     refreshUnreadCounts: fetchUnreadCounts
//   };
// };

// export default useUnreadMessages;

// src/hooks/useUnreadMessages.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiClient';

export default function useUnreadMessages() {
  const { user } = useAuth();
  const [unreadCounts, setUnreadCounts] = useState({}); 
  const [totalUnread, setTotalUnread] = useState(0);

  // 1) One‐time load at mount
  const fetchUnreadCounts = useCallback(async () => {
    if (!user?.email) return;
    try {
      const { data: counts = {} } = await apiClient.get('/chat/unread-counts');
      setUnreadCounts(counts);
      setTotalUnread(Object.values(counts).reduce((sum, c) => sum + c, 0));
    } catch (e) {
      console.error('Unread fetch failed', e);
      setUnreadCounts({});
      setTotalUnread(0);
    }
  }, [user?.email]);

  // 2) Mark a whole delivery read
  const markDeliveryAsRead = useCallback((deliveryId) => {
    setUnreadCounts(prev => {
      const next = { ...prev, [deliveryId]: 0 };
      setTotalUnread(Object.values(next).reduce((sum, c) => sum + c, 0));
      return next;
    });
    apiClient.post(`/chat/delivery/${deliveryId}/mark-all-read`)
             .catch(err => console.error('Mark‐all‐read failed', err));
  }, []);

  // 3) Increment on every NEW_MESSAGE
  const handleNewMessage = useCallback((message) => {
    // avoid bumping your own outgoing
    if (!user || message.senderName === user.email || message.senderName === user.fullName) {
      return;
    }
    const did = message.matchId;
    setUnreadCounts(prev => {
      const next = { ...prev, [did]: (prev[did] || 0) + 1 };
      setTotalUnread(Object.values(next).reduce((sum, c) => sum + c, 0));
      return next;
    });
  }, [user]);

  // 4) Decrement on a single‐message‐read
  const handleMessageRead = useCallback((deliveryId) => {
    setUnreadCounts(prev => {
      const newCount = Math.max(0, (prev[deliveryId] || 0) - 1);
      const next = { ...prev, [deliveryId]: newCount };
      setTotalUnread(Object.values(next).reduce((sum, c) => sum + c, 0));
      return next;
    });
  }, []);

  // Wire up the one‐time loader
  useEffect(() => { fetchUnreadCounts(); }, [fetchUnreadCounts]);

  return {
    unreadCounts,
    totalUnread,
    getUnreadCount: useCallback(id => unreadCounts[id] || 0, [unreadCounts]),
    markDeliveryAsRead,
    handleNewMessage,
    handleMessageRead,
    // if you need manual refresh:
    refreshUnreadCounts: fetchUnreadCounts
  };
}


