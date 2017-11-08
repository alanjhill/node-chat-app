const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

// Get the port from the environment variable
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.emit('newMessage', 
    generateMessage("Admin", "Welcome to the chat app")
  );

  socket.broadcast.emit('newMessage',
    generateMessage("Admin", "New user joined")
  );

  // socket.emit('newMessage', {
  //   from: "Alan",
  //   text: "Blah blah blah",
  //   createdAt: new Date()
  // })

  socket.on('createMessage', (message, callback) => {
    console.log("createMessage", message)
  
    io.emit('newMessage', 
      generateMessage(message.from, message.text)
    );

    callback("This is from the server");
  });

  socket.on('createLocationMessage', function(coords) {
    console.log("createLocationMessage", coords);
    io.emit('newLocationMessage', 
      generateLocationMessage('Admin', coords.latitude, coords.longitude)
  )
  }, function(error) {
    console.log("Error", error)
  });

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