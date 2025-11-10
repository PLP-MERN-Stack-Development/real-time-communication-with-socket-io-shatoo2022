import React, { useState, useEffect, useRef } from 'react';
import { useSocketContext } from '../contexts/SocketContext';

export const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, setTyping } = useSocketContext();
  const typingTimeoutRef = useRef(null);

  // Handle "is typing"
  useEffect(() => {
    if (message) {
      // User is typing
      setTyping(true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timeout to clear typing status
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 2000); // 2 seconds after last keystroke

    } else {
      // User stopped typing (cleared input)
      setTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, setTyping]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      setTyping(false); // Stop typing on send
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};