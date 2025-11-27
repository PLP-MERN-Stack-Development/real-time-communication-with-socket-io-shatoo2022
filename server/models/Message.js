// server/models/Message.js

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    // The username of the sender
    sender: {
        type: String,
        required: true,
    },
    // The Socket ID of the sender (optional, but useful for identification)
    senderId: {
        type: String,
        required: true,
    },
    // The actual content of the message
    message: {
        type: String,
        required: true,
    },
    // Unique ID for the message (MongoDB will automatically add '_id')
    id: { 
        type: Number, 
        required: true, 
        unique: true // Ensure the unique ID used in the client is also unique here
    },
    // The time the message was sent
    timestamp: {
        type: Date,
        default: Date.now,
    },
    // Flag for private messages (optional)
    isPrivate: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Message', MessageSchema);