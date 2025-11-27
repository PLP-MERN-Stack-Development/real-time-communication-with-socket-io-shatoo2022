import { useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';

// -----------------------------------------------------------------------
// IMPORTANT: Use Vite's environment variable loading for deployment
// It defaults to http://localhost:5000 in development if VITE_SOCKET_URL 
// is not set, or uses the value from .env.local/Vercel.
const SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
// -----------------------------------------------------------------------

export const useSocket = () => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    
    // State for Persistent Messages (from MongoDB)
    const [messages, setMessages] = useState([]); 
    
    // States for connected users and typing indicators (in-memory)
    const [userList, setUserList] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [username, setUsername] = useState(''); // To track the current user's name

    // Function to establish connection and join the chat
    const connect = useCallback((user) => {
        if (socketRef.current) return; 

        setUsername(user);
        const newSocket = io(SERVER_URL);
        socketRef.current = newSocket;

        newSocket.on('connect', () => {
            setIsConnected(true);
            // Emit user_join after connection is established
            newSocket.emit('user_join', user);
            console.log('Socket connected successfully.');
        });

        // Listener for Historical Messages (from MongoDB)
        newSocket.on('historical_messages', (historicalMessages) => {
            // Overwrite the state with history loaded from the database
            setMessages(historicalMessages); 
            console.log(`Loaded ${historicalMessages.length} historical messages.`);
        });

        // Listener for new messages (broadcasted after DB save)
        newSocket.on('receive_message', (newMessage) => {
            // Append the new, saved message to the state
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        
        // Listeners for user and typing lists
        newSocket.on('user_list', (users) => {
            setUserList(users);
        });
        
        newSocket.on('typing_users', (users) => {
            setTypingUsers(users);
        });

        // Handle disconnects
        newSocket.on('disconnect', () => {
            setIsConnected(false);
            setMessages([]);
            console.log('Socket disconnected.');
        });
        
        // Cleanup function
        return () => newSocket.close();
    }, []);
    
    // Function to send a message
    const sendMessage = useCallback((messageContent) => {
        if (socketRef.current && isConnected) {
            const messageData = {
                message: messageContent,
            };
            socketRef.current.emit('send_message', messageData);
        }
    }, [isConnected]);

    // Function to send typing status
    const sendTypingStatus = useCallback((isTyping) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('typing', isTyping);
        }
    }, [isConnected]);
    
    // Function to disconnect (if needed)
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            // Manually emit 'disconnect' which triggers the server's cleanup
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, []);

    return {
        isConnected,
        connect,
        disconnect,
        messages, 
        sendMessage,
        userList,
        typingUsers,
        sendTypingStatus,
        username,
    };
};