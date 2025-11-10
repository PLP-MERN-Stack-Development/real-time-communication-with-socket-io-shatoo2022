import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { SocketProvider } from './contexts/SocketContext.jsx'; // Import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap App with SocketProvider */}
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);