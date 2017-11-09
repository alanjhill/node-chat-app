const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

// Get the port from the environment variable
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    //socket.leave(params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // io.emit (all users) io.to(params.room).emit()
    // socket.broadcast.emit (all but me) socket.broadcast.to(params.room).emit()
    // socket.emit (one user) socket.emit()

    // Welcome message
    socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app"));

    // Broadcast message to other members of room
    socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} has joined`));

    callback();
  });

  // socket.emit('newMessage', {
  //   from: "Alan",
  //   text: "Blah blah blah",
  //   createdAt: new Date()
  // })

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage',
        generateMessage(message.from, message.text)
      );
    }
    callback("This is from the server");
  });

  socket.on('createLocationMessage', function (coords) {
    //console.log("createLocationMessage", coords);
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage',
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      )
    }
  }, function (error) {
    console.log("Error", error)
  });

  socket.on('disconnect', () => {
    console.log("User disconnected");
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

// Listen
server.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};