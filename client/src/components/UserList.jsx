import React from 'react';
import { useSocketContext } from '../contexts/SocketContext';

export const UserList = () => {
  const { users, socket, sendPrivateMessage } = useSocketContext();

  const handleUserClick = (user) => {
    if (user.id === socket.id) return; // Don't message yourself

    const message = prompt(`Send a private message to ${user.username}:`);
    if (message) {
      sendPrivateMessage(user.id, message);
    }
  };

  return (
    <aside className="user-list">
      <h3>Online Users ({users.length})</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className={user.id === socket.id ? 'is-self' : ''}
            onClick={() => handleUserClick(user)}
          >
            <span className="status"></span>
            {user.username} {user.id === socket.id ? '(You)' : ''}
          </li>
        ))}
      </ul>
    </aside>
  );
};