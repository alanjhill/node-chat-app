const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '/../public');

var app = express();
// Get the port from the environment variable
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

// Listen
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};