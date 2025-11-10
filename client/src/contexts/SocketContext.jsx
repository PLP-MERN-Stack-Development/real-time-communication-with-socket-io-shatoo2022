import React, { createContext, useContext } from 'react';
import { useSocket } from '../socket'; // Adjust path if needed

// Create the context
const SocketContext = createContext();

// Custom hook to use the socket context
export const useSocketContext = () => {
  return useContext(SocketContext);
};

// Provider component
export const SocketProvider = ({ children }) => {
  const socketData = useSocket();

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};