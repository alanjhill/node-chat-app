var socket = io();

function scrollToBottom() {
  // Selectors
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');

  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    console.log('Should scroll');
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  //console.log("Connected to server");
  var params = $.deparam(window.location.search);
  
  socket.emit('join', params, function(error) {
    if (error) {
      alert(error);
      window.location.href="/";
    } else {
      console.log("No error");
    }
  });
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
  scrollToBottom();
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
  scrollToBottom();
})

socket.on('disconnect', function() {
  console.log("Disconnected from server");
});

socket.on('updateUserList', function(users) {
  //console.log('Users list', users);
  var ol = $('<ol></ol>');

  users.forEach(function(user) {
    ol.append($('<li></li>').text(user));
  })

  $('#users').html(ol);
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