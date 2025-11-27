// server/server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const Message = require('./models/Message');

// Load environment variables (ensure path is correct)
dotenv.config({ path: path.resolve(__dirname, '.env') });

// --- Define CORS Origin ---
// Use the CLIENT_URL environment variable (from Render) or default to local dev URL
const CLIENT_ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';
// --------------------------

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
// --------------------------

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io Server with Dynamic CORS Origin
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN, // Uses the Vercel URL in production
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
// Apply CORS middleware to Express routes (API routes)
app.use(cors({ origin: CLIENT_ORIGIN })); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users (still in-memory, as user list is transient)
const users = {};
const typingUsers = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Function to load historical messages
  const loadHistoricalMessages = async () => {
    try {
      const historicalMessages = await Message.find()
        .sort({ id: -1 })
        .limit(100)
        .sort({ id: 1 });
        
      socket.emit('historical_messages', historicalMessages);
    } catch (error) {
      console.error('Error loading historical messages:', error);
      socket.emit('error', 'Failed to load chat history.');
    }
  };

  // Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);
    
    // Load messages for the joining user
    loadHistoricalMessages();
  });

  // Handle chat messages
  socket.on('send_message', async (messageData) => {
    const message = {
      ...messageData,
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      timestamp: new Date(),
    };
    
    try {
      // Save the message to MongoDB
      const newMessage = new Message(message);
      const savedMessage = await newMessage.save();
      
      // Emit the message received from the database
      io.emit('receive_message', savedMessage);
      
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', 'Message failed to save.');
    }
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    if (users[socket.id]) {
      const username = users[socket.id].username;
      
      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }
      
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Handle private messages
  socket.on('private_message', ({ to, message }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };
    
    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username } = users[socket.id];
      io.emit('user_left', { username, id: socket.id });
      console.log(`${username} left the chat`);
    }
    
    delete users[socket.id];
    delete typingUsers[socket.id];
    
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
});

// API routes
app.get('/api/messages', async (req, res) => {
  try {
    // Fetch messages from MongoDB
    const allMessages = await Message.find().sort({ timestamp: 1 });
    res.json(allMessages);
  } catch (error) {
    console.error('API error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };