import React from 'react';
import { useSocketContext } from '../contexts/SocketContext';

export const MessageItem = ({ message }) => {
  const { socket } = useSocketContext();

  // Check for system message
  if (message.system) {
    return <div className="message-item system-message">{message.message}</div>;
  }

  // Determine message type
  const isOwnMessage = message.senderId === socket.id;
  const messageClass = isOwnMessage
    ? 'own-message'
    : 'other-message';

  const formatTimestamp = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className={`message-item ${messageClass} ${message.isPrivate ? 'private-message' : ''}`}>
      {!isOwnMessage && (
        <div className="sender-info">
          {message.sender}
        </div>
      )}
      <div className="message-content">
        {message.isPrivate && <b>[Private] </b>}
        {message.message}
      </div>
      <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
    </div>
  );
};