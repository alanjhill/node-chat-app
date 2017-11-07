const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// Get the port from the environment variable
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.emit('newMessage', {
    from: "Alan",
    text: "Blah blah blah",
    createdAt: new Date()
  })

  socket.on('disconnect', () => {
    console.log("User disconnected");
  });

  socket.on('createMessage', (message) => {
    console.log("createMessage", message)
  
    socket.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date()
    });
  });
});

// Listen
server.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};