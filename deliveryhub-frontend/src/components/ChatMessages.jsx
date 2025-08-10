// src/components/ChatMessages.jsx
import React from 'react';

const ChatMessages = ({ messages, currentUser, otherUser }) => {
  
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      // Show time if within 24 hours
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Show date and time if older
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  // Render message status indicators
  const renderMessageStatus = (message, isCurrentUser) => {
    if (!isCurrentUser) return null; // Only show status for sent messages
    
    console.log('🔍 Message status debug:', {
      messageId: message.id,
      isRead: message.isRead,
      isDelivered: message.isDelivered,
      isCurrentUser: isCurrentUser,
      senderName: message.senderName,
      senderId: message.senderId,
      content: message.content.substring(0, 20) + '...' // First 20 chars
    });
    
    if (message.isRead) {
      return <span style={styles.readStatus}>✓✓</span>; // Double check for read
    } else if (message.isDelivered) {
      return <span style={styles.deliveredStatus}>✓</span>; // Single check for delivered
    } else {
      return <span style={styles.sentStatus}>⏰</span>; // Clock for sent
    }
  };

  // Render message content based on type
  const renderMessageContent = (message) => {
    switch (message.messageType) {
      case 'FILE':
        return (
          <div>
            <div style={styles.messageText}>{message.content}</div>
            {message.fileUrl && (
              <div style={styles.fileContainer}>
                <a 
                  href={message.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.fileLink}
                >
                  📎 {message.fileName || 'Download file'}
                </a>
              </div>
            )}
          </div>
        );
      
      case 'LOCATION':
        return (
          <div>
            <div style={styles.messageText}>{message.content}</div>
            {message.latitude && message.longitude && (
              <div style={styles.locationContainer}>
                <a
                  href={`https://maps.google.com/?q=${message.latitude},${message.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.locationLink}
                >
                  📍 View location on map
                </a>
              </div>
            )}
          </div>
        );
      
      case 'SYSTEM':
        return (
          <div style={styles.systemMessageText}>
            {message.content}
          </div>
        );
      
      default:
        return <div style={styles.messageText}>{message.content}</div>;
    }
  };

  const styles = {
    container: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    messageGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    messageGroupSent: {
      alignItems: 'flex-end'
    },
    messageBubble: {
      maxWidth: '80%',
      padding: '12px 16px',
      borderRadius: '18px',
      position: 'relative',
      wordWrap: 'break-word'
    },
    messageBubbleReceived: {
      backgroundColor: '#f3f4f6',
      color: '#1f2937',
      borderBottomLeftRadius: '4px'
    },
    messageBubbleSent: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderBottomRightRadius: '4px'
    },
    systemMessageBubble: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      textAlign: 'center',
      alignSelf: 'center',
      maxWidth: '90%',
      fontSize: '14px',
      fontStyle: 'italic'
    },
    messageText: {
      fontSize: '15px',
      lineHeight: '1.4',
      margin: 0
    },
    systemMessageText: {
      fontSize: '14px',
      lineHeight: '1.4',
      margin: 0,
      textAlign: 'center'
    },
    messageInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end', // Always align timestamp to the right
      gap: '8px',
      marginTop: '4px',
      fontSize: '12px',
      color: '#6b7280'
    },
    timestamp: {
      fontSize: '11px'
    },
    readStatus: {
      fontSize: '11px',
      color: '#10b981', // Green for read
      marginLeft: '4px'
    },
    deliveredStatus: {
      fontSize: '11px',
      color: '#10b981', // Green for delivered
      marginLeft: '4px'
    },
    sentStatus: {
      fontSize: '11px',
      color: '#9ca3af', // Gray for sent
      marginLeft: '4px'
    },
    fileContainer: {
      marginTop: '8px',
      padding: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px'
    },
    fileLink: {
      color: 'inherit',
      textDecoration: 'none',
      fontSize: '14px'
    },
    locationContainer: {
      marginTop: '8px',
      padding: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px'
    },
    locationLink: {
      color: 'inherit',
      textDecoration: 'none',
      fontSize: '14px'
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280',
      fontSize: '16px',
      textAlign: 'center',
      padding: '40px'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    }
  };

  // Show empty state if no messages
  if (!messages || messages.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💬</div>
          <div>No messages yet</div>
          <div style={{ fontSize: '14px', marginTop: '8px', color: '#9ca3af' }}>
            Start the conversation!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === currentUser?.id;
        const isSystem = message.messageType === 'SYSTEM';

        // Debug logging
        console.log('🔍 User debug:', {
          messageSenderId: message.senderId,
          currentUserId: currentUser?.id,
          isCurrentUser: isCurrentUser,
          senderName: message.senderName
        });

        if (isSystem) {
          return (
            <div key={message.id || index} style={styles.messageGroup}>
              <div style={{...styles.messageBubble, ...styles.systemMessageBubble}}>
                {renderMessageContent(message)}
              </div>
              <div style={styles.messageInfo}>
                <span style={styles.timestamp}>{formatTime(message.timestamp)}</span>
              </div>
            </div>
          );
        }

        return (
          <div 
            key={message.id || index} 
            style={{
              ...styles.messageGroup,
              ...(isCurrentUser ? styles.messageGroupSent : {})
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                ...(isCurrentUser ? styles.messageBubbleSent : styles.messageBubbleReceived)
              }}
            >
              {renderMessageContent(message)}
            </div>
            
            <div style={styles.messageInfo}>
              <span style={styles.timestamp}>{formatTime(message.timestamp)}</span>
              {renderMessageStatus(message, isCurrentUser)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;