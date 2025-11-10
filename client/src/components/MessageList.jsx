import React, { useEffect, useRef } from 'react';
import { useSocketContext } from '../contexts/SocketContext';
import { MessageItem } from './MessageItem';

export const MessageList = () => {
  const { messages } = useSocketContext();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};