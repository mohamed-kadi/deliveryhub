// src/components/ChatInput.jsx
import React, { useState, useRef, useCallback } from 'react';

const ChatInput = ({ onSendMessage, disabled, delivery }) => {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Handle sending text message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    onSendMessage(trimmedMessage, 'CHAT');
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle Enter key (send message on Enter, new line on Shift+Enter)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file || !delivery) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('deliveryId', delivery.id);

      // Upload file to backend
      const response = await fetch('http://localhost:8080/api/chat/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const result = await response.json();
      
      // Send file message
      onSendMessage(
        `Shared a file: ${file.name}`,
        'FILE',
        result.fileUrl,
        file.name
      );

    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [delivery, onSendMessage]);

  // Share current location
  const shareLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSendMessage(
          `Shared location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          'LOCATION',
          null,
          null
        );
      },
      (error) => {
        console.error('Location error:', error);
        alert('Failed to get location. Please check your browser permissions.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, [onSendMessage]);

  const styles = {
    container: {
      padding: '16px', // Change from '16px 20px' to just '16px'
      borderTop: '1px solid #e5e7eb',
      backgroundColor: 'white',
    },
    form: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',  // Reduce gap from 12px to 8px
    },
    inputContainer: {
      flex: 1,
      position: 'relative',
      boxSizing: 'border-box', // Add this to create space from the edge
    },
    textarea: {
      width: '100%',
      minHeight: '40px',
      maxHeight: '120px',
      padding: '12px 60px 12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '20px',
      resize: 'none',
      fontSize: '15px',
      lineHeight: '1.4',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s',
      backgroundColor: disabled ? '#f9fafb' : 'white',
      boxSizing: 'border-box'
    },
    textareaFocused: {
      borderColor: '#3b82f6'
    },
    actionsContainer: {
      position: 'absolute',
      right: '4px', // Change from 8px to 4px
      bottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    actionButton: {
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '16px',
      transition: 'all 0.2s',
      opacity: disabled ? 0.5 : 1
    },
    sendButton: {
      backgroundColor: message.trim() ? '#3b82f6' : '#d1d5db',
      color: message.trim() ? 'white' : '#374151',
      border: '2px solid transparent', // add visible border
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: (disabled || !message.trim()) ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s',
      opacity: disabled ? 0.5 : 1,
      flexShrink: 0,  // Prevents button from shrinking
      alignSelf: 'center' // Forces button to center align within the form
    },
    hiddenFileInput: {
      display: 'none'
    },
    uploadingIndicator: {
      fontSize: '12px',
      color: '#3b82f6',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    spinner: {
      width: '12px',
      height: '12px',
      border: '2px solid #e5e7eb',
      borderTop: '2px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <form onSubmit={handleSendMessage} style={styles.form}>
        <div style={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={disabled ? "Connecting..." : "Type a message..."}
            disabled={disabled}
            style={{
              ...styles.textarea,
              ...(document.activeElement === textareaRef.current ? styles.textareaFocused : {})
            }}
            rows={1}
          />
          
          <div style={styles.actionsContainer}>
            {/* File Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
              style={{
                ...styles.actionButton,
                color: '#6b7280'
              }}
              onMouseOver={(e) => !disabled && (e.target.style.backgroundColor = '#f3f4f6')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
              title="Upload file"
            >
              📎
            </button>

            {/* Location Share Button */}
            <button
              type="button"
              onClick={shareLocation}
              disabled={disabled}
              style={{
                ...styles.actionButton,
                color: '#6b7280'
              }}
              onMouseOver={(e) => !disabled && (e.target.style.backgroundColor = '#f3f4f6')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
              title="Share location"
            >
              📍
            </button>
          </div>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          style={styles.sendButton}
          onMouseOver={(e) => {
            if (!disabled && message.trim()) {
              e.target.style.backgroundColor = '#2563eb';
            }
          }}
          onMouseOut={(e) => {
            if (message.trim()) {
              e.target.style.backgroundColor = '#3b82f6';
            } else {
                e.target.style.backgroundColor = '#d1d5db';
            }
              e.target.style.transform = 'scale(1)';
          }}
        >
          ▲
  
        </button>
      </form>

      {/* File Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        style={styles.hiddenFileInput}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      {/* Upload Indicator */}
      {uploading && (
        <div style={styles.uploadingIndicator}>
          <div style={styles.spinner}></div>
          Uploading file...
        </div>
      )}
    </div>
  );
};

export default ChatInput;