var socket = io();

socket.on('connect', function() {
  console.log("Connected to server");
});

socket.on('newMessage', function(message) {
  console.log("newMessage", message);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  var li = $('<li></li>');
  var a = $('<a target="_blank">My Current Location</a>');
  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#messages').append(li);
})
socket.on('disconnect', function() {
  console.log("Disconnected from server");
});

socket.emit('createMessage', {
  from: "Frank",
  text: "Hi"
}, function(data) {
  console.log("Got it:", data);
});

$('#message-form').on('submit', function(e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=text]').val()
  }, function(data) {
    console.log("data", data);
  })
});

var locationButton = $('#send-location');
locationButton.on('click', function(e) {
  console.log("button clicked");
  if (!navigator.geolocation) {
    return alert("Sorry, geolocation not supported");
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    console.log("position", position);
    socket.emit("createLocationMessage", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(error) {
    console.log("error", error);
    alert("Unable to fetch location: " + error);
  });
});