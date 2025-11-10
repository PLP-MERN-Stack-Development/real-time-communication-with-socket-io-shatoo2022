import React from 'react';
import { useSocketContext } from './contexts/SocketContext';
import { Login } from './components/Login';
import { UserList } from './components/UserList';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { TypingIndicator } from './components/TypingIndicator';
import './App.css';

function App() {
  const { isConnected, connect, disconnect } = useSocketContext();

  const handleLogin = (username) => {
    // The `connect` function from your hook already
    // connects AND emits 'user_join'
    connect(username);
  };

  if (!isConnected) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <div className="chat-interface">
        <UserList />
        <div className="chat-window">
          <MessageList />
          <TypingIndicator />
          <MessageInput />
        </div>
      </div>
    </div>
  );
}

export default App;