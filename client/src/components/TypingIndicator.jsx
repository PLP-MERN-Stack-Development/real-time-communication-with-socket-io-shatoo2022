import React from 'react';
import { useSocketContext } from '../contexts/SocketContext';

export const TypingIndicator = () => {
  const { typingUsers, socket } = useSocketContext();

  // Filter out the current user
  const otherTypingUsers = typingUsers.filter(
    (username, index) => {
      // Find the user object by username to get their ID
      // Note: This is a bit inefficient. Your server 'typingUsers' stores usernames, not IDs.
      // For a robust solution, the server should send back IDs or the client should filter by username.
      // For now, we'll just display all typing users including self, or filter by name.
      // Let's modify the server to store objects {id, username} in typingUsers.

      // ----
      // **SERVER-SIDE CHANGE (Optional but recommended):**
      // In your `server.js`, inside `socket.on('typing', ...)`, change:
      // `typingUsers[socket.id] = username;`
      // TO:
      // `typingUsers[socket.id] = { id: socket.id, username };`
      // And change:
      // `io.emit('typing_users', Object.values(typingUsers));` (This is already correct)
      // ----

      // **CLIENT-SIDE (Assuming server sends {id, username} objects):**
      // Your current server code `Object.values(typingUsers)` sends an array of *usernames*.
      // Let's filter out our own username if it's in the list.
      const currentUser = useSocketContext().users.find(u => u.id === socket.id);
      const currentUsername = currentUser ? currentUser.username : '';

      return username !== currentUsername;
    }
  );

  if (otherTypingUsers.length === 0) {
    return <div className="typing-indicator"></div>;
  }

  if (otherTypingUsers.length === 1) {
    return <div className="typing-indicator">{otherTypingUsers[0]} is typing...</div>;
  }

  if (otherTypingUsers.length > 2) {
    return <div className="typing-indicator">Several people are typing...</div>;
  }

  return (
    <div className="typing-indicator">
      {otherTypingUsers.join(' and ')} are typing...
    </div>
  );
};