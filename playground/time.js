const moment = require('moment');

var date = moment();
console.log(date.format('Do MMM YYYY HH:mm:ss'));

var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('h:mm a'));

var someTimestamp = moment().valueOf();
console.log(someTimestamp);