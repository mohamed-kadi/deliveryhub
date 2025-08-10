import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Message } from '../types';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinDeliveryRoom: (deliveryId: number) => void;
  leaveDeliveryRoom: (deliveryId: number) => void;
  sendMessage: (deliveryId: number, content: string) => void;
  onNewMessage: (callback: (message: Message) => void) => void;
  onMessageRead: (callback: (messageId: number) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user) {
      const newSocket = io(process.env.REACT_APP_WS_URL || 'http://localhost:8080', {
        auth: {
          token: token,
        },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [token, user]);

  const joinDeliveryRoom = (deliveryId: number) => {
    if (socket) {
      socket.emit('join-delivery', deliveryId);
    }
  };

  const leaveDeliveryRoom = (deliveryId: number) => {
    if (socket) {
      socket.emit('leave-delivery', deliveryId);
    }
  };

  const sendMessage = (deliveryId: number, content: string) => {
    if (socket) {
      socket.emit('send-message', {
        deliveryId,
        content,
      });
    }
  };

  const onNewMessage = (callback: (message: Message) => void) => {
    if (socket) {
      socket.on('new-message', callback);
      return () => socket.off('new-message', callback);
    }
  };

  const onMessageRead = (callback: (messageId: number) => void) => {
    if (socket) {
      socket.on('message-read', callback);
      return () => socket.off('message-read', callback);
    }
  };

  const value: WebSocketContextType = {
    socket,
    isConnected,
    joinDeliveryRoom,
    leaveDeliveryRoom,
    sendMessage,
    onNewMessage,
    onMessageRead,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};