import { useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:5000'; // Ensure this matches your server port

export const useSocket = () => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    
    // 1. New State for Persistent Messages
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

        // 2. NEW: Listener for Historical Messages (from MongoDB)
        newSocket.on('historical_messages', (historicalMessages) => {
            // Overwrite the state with history loaded from the database
            setMessages(historicalMessages); 
            console.log(`Loaded ${historicalMessages.length} historical messages.`);
        });

        // 3. UPDATED: Listener for new messages (broadcasted after DB save)
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
                // The server will use the socket.id to fetch the username, 
                // but we pass content here.
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
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, []);

    return {
        isConnected,
        connect,
        disconnect,
        // Export the new message state
        messages, 
        sendMessage,
        userList,
        typingUsers,
        sendTypingStatus,
        username, // Export the current username
    };
};