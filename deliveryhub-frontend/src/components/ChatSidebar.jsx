// src/components/ChatSidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiClient';


const ChatSidebar = ({ isOpen, onClose, delivery, onMessageRead }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);


// WebSocket connection
  const { connected, connecting, sendMessage, markAsRead } = useWebSocket(
    delivery?.id, 
    (newMessage) => {
      // Check if message already exists to prevent duplicates
      setMessages(prev => {
        // Check if this message ID already exists
        if (newMessage.id && prev.some(msg => msg.id === newMessage.id)) {
          console.log('Duplicate message prevented:', newMessage.id);
          return prev;
        }
        
        // For messages without ID, check if it's a duplicate by content and timestamp
        const isDuplicate = prev.some(msg => 
          msg.content === newMessage.content && 
          msg.senderId === newMessage.senderId &&
          Math.abs(new Date(msg.timestamp) - new Date(newMessage.timestamp)) < 1000 // Within 1 second
        );
        
        if (isDuplicate) {
          console.log('Duplicate message prevented by content match');
          return prev;
        }
        
        // Add the new message
        return [...prev, newMessage];
      });
      
      scrollToBottom();
      
      // // Mark as read if message is from other user
      // if (newMessage.senderId !== currentUserId) {
      //   if (isOpen) {
      //     onMessageRead(delivery.id)
      //   } else {
      //     onNewMessage({ matchId: delivery.id });
      //   }
      // }
    },
    // // Notification callback for real-time updates
    // (notification) => {
    //   console.log('🔔 Notification received:', notification);
      
    //   if (notification.type === 'NEW_MESSAGE') {
    //     const did = notification.deliveryId;
    //     if (did !== delivery?.id) {
    //       onNewMessage({ matchId: did });
    //     }
    //   }
    // }
    null
  );

    //   // 🔔 Bulk‐read when opening the chat
    // useEffect(() => {
    //   if (isOpen && delivery?.id && connected) {
    //     wsMarkAllAsRead(delivery.id);
    //     onMessageRead(delivery.id);
    //   }
    // }, [isOpen, delivery, connected, wsMarkAllAsRead, onMessageRead]);

    
    // In your ChatSidebar.jsx, add this useEffect (if it's missing):
useEffect(() => {
  const fetchCurrentUserId = async () => {
    if (!user?.email) return;
    
    try {
      console.log('🔍 Fetching user ID for:', user.email);
      const response = await apiClient.get('/users/me');
      console.log('🔍 Fetched user data:', response.data);
      setCurrentUserId(response.data.id);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  if (isOpen && user) {
    fetchCurrentUserId();
  }
}, [isOpen, user]);
  
  

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history when delivery changes
  useEffect(() => {
    if (delivery && isOpen) {
      loadChatHistory();
      identifyOtherUser();
    }
  }, [delivery, isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing messages from backend
  const loadChatHistory = async () => {
    if (!delivery?.id) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/chat/delivery/${delivery.id}/messages?limit=50`);
      setMessages(response.data || []);

    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Identify the other user (customer or transporter)
  const identifyOtherUser = () => {
    if (!delivery || !user) return;
    
    
    // If current user is customer, other user is transporter
    if (user.role === 'CUSTOMER') {
      setOtherUser({
        id: delivery.transporterId,
        name: delivery.transporterName || 'Transporter',
        role: 'TRANSPORTER'
      });
    } else {
      // If current user is transporter, other user is customer
      setOtherUser({
        id: delivery.customerId,
        name: delivery.customerName || 'Customer', 
        role: 'CUSTOMER'
      });
    }
  };

  // Handle sending new message
  const handleSendMessage = (content, messageType = 'CHAT', fileUrl = null, fileName = null) => {
    if (!delivery || !user || !connected || !currentUserId) {
      console.error('Cannot send message - missing requirements:', {
      delivery: !!delivery,
      user: !!user, 
      connected,
      currentUserId
    });
      return;
    }

    const messageData = {
      matchId: delivery.id,
      senderId: currentUserId,
      senderName: user.fullName || user.email,
      senderRole: user.role,
      content: content,
      messageType: messageType,
      fileUrl: fileUrl,
      fileName: fileName,
    };

    const success = sendMessage(messageData);
    if (!success) {
      // Show error message to user
      alert('Failed to send message. Please check your connection.');
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    },
    sidebar: {
      width: '400px',
      maxWidth: '90vw',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out'
    },
    header: {
      padding: '20px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerInfo: {
      flex: 1
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '4px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280'
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px',
      borderRadius: '4px',
      transition: 'all 0.2s'
    },
    connectionStatus: {
      padding: '8px 20px',
      backgroundColor: connected ? '#d1fae5' : connecting ? '#fef3c7' : '#fee2e2',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '12px',
      textAlign: 'center',
      color: connected ? '#065f46' : connecting ? '#92400e' : '#dc2626'
    },
    messagesContainer: {
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280'
    },
    deliveryInfo: {
      padding: '12px 20px',
      backgroundColor: '#f0f4ff',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '12px',
      color: '#1e40af'
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <div style={styles.title}>
              {otherUser ? `Chat with ${otherUser.role === 'CUSTOMER' ? 'Customer' : 'Transporter'} (${otherUser.name})` : 'Loading...'}
            </div>
            <div style={styles.subtitle}>
              {delivery ? `Delivery #${delivery.id}` : 'No delivery selected'}
            </div>
          </div>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        {/* Connection Status */}
        <div style={styles.connectionStatus}>
          {connected ? '🟢 Connected' : connecting ? '🟡 Connecting...' : '🔴 Disconnected'}
        </div>

        {/* Delivery Info */}
        {delivery && (
          <div style={styles.deliveryInfo}>
            📦 {delivery.itemType} • {delivery.pickupCity} → {delivery.dropoffCity}
          </div>
        )}

        {/* Messages Container */}
        <div style={styles.messagesContainer}>
          {loading ? (
            <div style={styles.loadingContainer}>
              Loading messages...
            </div>
          ) : (
            <>
              <ChatMessages 
                messages={messages} 
                currentUser={{ id: currentUserId }}
                otherUser={otherUser}
              />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={!connected || loading}
          delivery={delivery}
        />
      </div>
    </div>
  );
};

export default ChatSidebar;

