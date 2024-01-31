const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatty', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Mongoose schema and model (models/Message.js)
const Message = mongoose.model('Message', {
  user: String,
  text: String,
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for new messages
  socket.on('message', (data) => {
    // Save the message to MongoDB
    const message = new Message(data);
    message.save();

    // Broadcast the message to all connected clients
    io.emit('message', data);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
