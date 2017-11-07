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

  socket.on('disconnect', () => {
    console.log("User disconnected");
  });
});

// Listen
server.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};