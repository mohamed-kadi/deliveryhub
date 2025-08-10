// src/hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getAccessToken } from '../services/authService';

// Add this at the top after your imports
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return {};
  }
};

const useWebSocket = (deliveryId, onMessageReceived, onNotificationReceived) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const notificationSubRef = useRef(null);

  // Initialize and connect
  useEffect(() => {
    const token = getAccessToken() || localStorage.getItem('token');
    
    if (!token) {
      console.error('No authentication token available');
      return;
    }

    if (clientRef.current) {
      return; // Already initialized
    }

    console.log('🔍 Initializing WebSocket connection...');
    setConnecting(true);

    // Create STOMP client
    const client = new Client({
      brokerURL: `ws://localhost:8080/ws?token=${token}`,
      
      // Use SockJS
      webSocketFactory: () => {
        return new SockJS(`http://localhost:8080/ws?token=${token}`);
      },
      
      // Debug
      debug: (str) => {
        console.log('STOMP:', str);
        // Log received messages
        if (str.includes('MESSAGE') && str.includes('destination:')) {
          console.log('📩 STOMP MESSAGE Frame detected');
        }
      },
      
      // Reconnection
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      // Connection callback
      onConnect: (frame) => {
        console.log('✅ Connected to WebSocket');
        console.log('Connection details:', frame);
        setConnected(true);
        setConnecting(false);
        
        // Subscribe to delivery chat if deliveryId exists
        if (deliveryId) {
          const destination = `/topic/delivery.${deliveryId}.chat`;
          subscriptionRef.current = client.subscribe(destination, (message) => {
            try {
              const chatMessage = JSON.parse(message.body);
              console.log('📨 Received message:', chatMessage);
              
              if (onMessageReceived) {
                onMessageReceived(chatMessage);
              }
            } catch (error) {
              console.error('❌ Error parsing message:', error);
            }
          });
          console.log('📡 Subscribed to:', destination);
        }
        
        // Subscribe to user notifications
        try {
          const userEmail = parseJwt(token).sub;
          if (userEmail) {
            const notificationDestination = `/user/${userEmail}/queue/notifications`;
            notificationSubRef.current = client.subscribe(notificationDestination, (message) => {
              try {
                const notification = JSON.parse(message.body);
                console.log('🔔 Received notification:', notification);
                
                if (onNotificationReceived) {
                  onNotificationReceived(notification);
                }
              } catch (e) {
                console.error('Error parsing notification:', e);
              }
            });
            console.log('📡 Subscribed to notifications:', notificationDestination);
          }
        } catch (error) {
          console.error('❌ Error setting up notifications:', error);
        }
      },
      
      // Error callback
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers['message']);
        console.error('Error body:', frame.body);
      },
      
      // Disconnect callback
      onDisconnect: (frame) => {
        console.log('🔌 Disconnected:', frame);
        setConnected(false);
        setConnecting(false);
      },
      
      // WebSocket error
      onWebSocketError: (error) => {
        console.error('❌ WebSocket error:', error);
      },
      
      // WebSocket close
      onWebSocketClose: (event) => {
        console.log('❌ WebSocket closed:', event);
        setConnected(false);
        setConnecting(false);
      }
    });

    // Activate the client
    client.activate();
    clientRef.current = client;

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up WebSocket connection...');
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      if (notificationSubRef.current) {
        notificationSubRef.current.unsubscribe();
        notificationSubRef.current = null;
      }
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Handle delivery ID changes
  useEffect(() => {
    if (!clientRef.current?.connected || !deliveryId) {
      return;
    }

    // Unsubscribe from previous delivery
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Subscribe to new delivery
    const destination = `/topic/delivery.${deliveryId}.chat`;
    subscriptionRef.current = clientRef.current.subscribe(destination, (message) => {
      try {
        const chatMessage = JSON.parse(message.body);
        console.log('📨 Received message:', chatMessage);
        
        if (onMessageReceived) {
          onMessageReceived(chatMessage);
        }
      } catch (error) {
        console.error('❌ Error parsing message:', error);
      }
    });
    console.log('📡 Resubscribed to:', destination);
  }, [deliveryId, onMessageReceived]);

  // Send message
  const sendMessage = useCallback((messageData) => {
    if (!clientRef.current?.connected) {
      console.error('Cannot send message - not connected to WebSocket');
      return false;
    }

    try {
      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(messageData)
      });
      console.log('📤 Message sent:', messageData);
      return true;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return false;
    }
  }, []);

  // Mark message as read
  const markAsRead = useCallback((messageId) => {
    if (!clientRef.current?.connected) {
      console.error('Cannot mark as read - not connected to WebSocket');
      return false;
    }

    try {
      clientRef.current.publish({
        destination: '/app/chat.read',
        body: JSON.stringify(messageId)
      });
      console.log('✅ Marked as read:', messageId);
      return true;
    } catch (error) {
      console.error('❌ Error marking as read:', error);
      return false;
    }
  }, []);

  // after markAsRead…
const markAllAsRead = useCallback((deliveryId) => {
  if (!clientRef.current?.connected) return false;
  clientRef.current.publish({
    destination: '/app/chat.readAll',
    body: JSON.stringify(deliveryId),
  });
  console.log('📖 Sent chat.readAll for delivery', deliveryId);
  return true;
}, []);


  // Manual reconnect
  const reconnect = useCallback(() => {
    if (clientRef.current) {
      console.log('🔄 Manual reconnect triggered');
      clientRef.current.activate();
    }
  }, []);

  return {
    connected,
    connecting,
    sendMessage,
    markAsRead,
    markAllAsRead,
    reconnect
  };
};

export default useWebSocket;
