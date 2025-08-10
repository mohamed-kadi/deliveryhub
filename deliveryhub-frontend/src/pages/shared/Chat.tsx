import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Message } from '../../types';
import { chatAPI, deliveryAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { 
  Send, 
  Paperclip, 
  Download, 
  ArrowLeft,
  Package,
  User
} from 'lucide-react';

const Chat: React.FC = () => {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const { user } = useAuth();
  const { sendMessage, isConnected } = useWebSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (deliveryId) {
      fetchDelivery();
      fetchMessages();
    }
  }, [deliveryId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDelivery = async () => {
    try {
      const data = await deliveryAPI.getById(Number(deliveryId));
      setDelivery(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch delivery details');
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await chatAPI.getMessages(Number(deliveryId));
      setMessages(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !deliveryId) return;

    try {
      const message = await chatAPI.sendMessage(Number(deliveryId), newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Send via WebSocket for real-time updates
      if (isConnected) {
        sendMessage(Number(deliveryId), newMessage);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send message');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !deliveryId) return;

    try {
      setUploading(true);
      const message = await chatAPI.uploadFile(Number(deliveryId), file);
      setMessages([...messages, message]);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadFile = async (messageId: number, fileName: string) => {
    try {
      const blob = await chatAPI.downloadFile(messageId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to download file');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={user?.role === 'CUSTOMER' ? '/deliveries' : '/transporter/deliveries'}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Link>
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-primary-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Delivery #{deliveryId}
                </h1>
                {delivery && (
                  <p className="text-sm text-gray-600">
                    Chat with {user?.role === 'CUSTOMER' ? delivery.transporter?.fullName : delivery.customer?.fullName}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 underline mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.sender.id === user?.id;
            const showDate = index === 0 || 
              formatDate(message.sentAt) !== formatDate(messages[index - 1].sentAt);
            
            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center text-sm text-gray-500 my-4">
                    {formatDate(message.sentAt)}
                  </div>
                )}
                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    {!isOwn && (
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-3 w-3" />
                        <span className="text-xs font-medium">{message.sender.fullName}</span>
                      </div>
                    )}
                    
                    {message.fileName ? (
                      <div className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4" />
                        <span className="flex-1">{message.fileName}</span>
                        <button
                          onClick={() => handleDownloadFile(message.id, message.fileName!)}
                          className="hover:opacity-75"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    
                    <div className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                      {formatTime(message.sentAt)}
                      {message.readAt && isOwn && (
                        <span className="ml-2">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="flex-shrink-0 bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        {uploading && (
          <div className="mt-2 text-sm text-gray-600">
            Uploading file...
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};

export default Chat;