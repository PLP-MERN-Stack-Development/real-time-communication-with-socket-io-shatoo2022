# Real-Time Chat Application

A modern real-time chat application built with React, Socket.IO, and Node.js. This application enables users to communicate in real-time with features like private messaging, typing indicators, and user presence detection.

## Features

- 💬 Real-time messaging
- 🔐 User authentication
- 👥 Online users list with status indicators
- 📱 Private messaging functionality
- ⌨️ Typing indicators
- 🔔 System notifications
- 📱 Responsive design

## Application Screenshots

### Chat Interface
![Chat Interface](./screenshorts/chartsocketio.png)



### Login Screen
![Login Screen](screenshorts/loginsocketio.png)


## Tech Stack

### Frontend
- React (Vite)
- Socket.IO Client
- CSS3 for styling
- Context API for state management

### Backend
- Node.js
- Express.js
- Socket.IO

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.jsx
│   │   │   └── UserList.jsx
│   │   ├── context/      # Context providers
│   │   │   └── SocketContext.jsx
│   │   ├── App.jsx       # Main App component
│   │   ├── socket.js     # Socket.IO client setup
│   │   └── App.css       # Styling
│   └── package.json
│
└── server/                # Backend Node.js server
    ├── server.js         # Express and Socket.IO setup
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-shatoo2022.git
cd real-time-communication-with-socket-io-shatoo2022
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

### Running the Application

1. Start the server
```bash
cd server
npm start
```

2. Start the client (in a new terminal)
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## Features Implementation Details

### Real-time Messaging
- Implemented using Socket.IO events for instant message delivery
- Messages include sender information and timestamps
- Supports both group and private messaging

### User Authentication
- Simple username-based authentication
- Unique user identification
- User session management

### Online Users
- Real-time user presence detection
- Status indicators for online/offline users
- User list updates automatically

### Private Messaging
- Direct messaging between users
- Visual indicators for private messages
- Separate message styling for private communications

### Typing Indicators
- Real-time typing status updates
- Visual feedback when users are typing
- Automatic clearing of typing status

### System Notifications
- Join/leave notifications
- Connection status updates
- Private message alerts

## Future Enhancements

- 🔒 Secure user authentication with JWT
- 💾 Message persistence with MongoDB
- 📸 File sharing capabilities
- 🎨 Customizable themes
- 🔍 Message search functionality
- 📱 Mobile application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Socket.IO team for the excellent real-time engine
- React team for the amazing frontend library
- PLP MERN Stack Development course instructors and mentors