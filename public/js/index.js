var socket = io();

socket.on('connect', function() {
  console.log("Connected to server");
});

socket.on('newMessage', function(message) {
  console.log("newMessage", message);
  var formattedTime = moment(message.createdAt).format('hh:mm');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  // var formattedTime = moment(message.createdAt).format('hh:mm');
  // var li = $('<li></li>');
  // li.text(`${formattedTime} ${message.from}: ${message.text}`);
  // $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  console.log("newMessage", message);
  var formattedTime = moment(message.createdAt).format('hh:mm');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  $('#messages').append(html);
})
socket.on('disconnect', function() {
  console.log("Disconnected from server");
});

// socket.emit('createMessage', {
//   from: "Frank",
//   text: "Hi"
// }, function(data) {
//   console.log("Got it:", data);
// });

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