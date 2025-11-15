const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./ROUTES/userRoutes');
const messageRoutes = require('./ROUTES/messageRoutes');
const mongoose = require("mongoose");
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();
require('./db');

const app = express();

// Middleware setup
app.use(cors({
  origin: true, // frontend URL
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 6000;

// Disable caching for auth routes
app.use('/auth/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Routes
app.use('/auth/api', userRoutes);
app.use('/auth/message', messageRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Server is running fine " });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: false, message: 'Internal server error' });
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});


// Track online users globally
global.onlineUsers = new Map();

// Socket.IO logic
io.on("connection", (socket) => {
  console.log(` User connected: ${socket.id}`);

  // When a user logs in / connects
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
    console.log(` User ${userId} added with socket ID: ${socket.id}`);
  });

  // Sending a message to a specific user
  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);

    console.log(`📨 Message from ${data.from} to ${data.to}: ${data.message}`);

    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log(` User disconnected: ${socket.id}`);
    for (let [userId, id] of global.onlineUsers.entries()) {
      if (id === socket.id) {
        global.onlineUsers.delete(userId);
        console.log(`User ${userId} removed from online users`);
        break;
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
