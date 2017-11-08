var socket = io();

socket.on('connect', function() {
  console.log("Connected to server");
});

socket.on('newMessage', function(message) {
  console.log("newMessage", message);
  var formattedTime = moment(message.createdAt).format('hh:mm');
  var li = $('<li></li>');
  li.text(`${formattedTime} ${message.from}: ${message.text}`);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('hh:mm');
  var li = $('<li></li>');
  var a = $('<a target="_blank">My Current Location</a>');
  li.text(`${formattedTime} ${message.from}: `);
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

  var messageTextBox = $('[name=text]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function(data) {
    console.log("data", data);
    messageTextBox.val('');
  })
});

var locationButton = $('#send-location');
locationButton.on('click', function(e) {
  console.log("button clicked");
  if (!navigator.geolocation) {
    return alert("Sorry, geolocation not supported");
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    console.log("position", position);
    socket.emit("createLocationMessage", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    locationButton.removeAttr('disabled').text('Send location');
  }, function(error) {
    console.log("error", error);
    alert("Unable to fetch location: " + error);
    locationButton.removeAttr('disabled').text('Send location');
  });
});