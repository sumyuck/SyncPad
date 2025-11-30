// server.js (Final Version)

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handleSocketEvents = require('./socketHandler'); // <-- Import our new handler

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? false  // Same origin in production
            : ["http://localhost:3000", "http://localhost:4000"],  // Allow React dev server and same origin
        methods: ["GET", "POST"],
        credentials: true
    }
});

// This part is important for serving the React App
app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Hand off all socket connection logic to our handler
io.on('connection', (socket) => {
    handleSocketEvents(io, socket);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));