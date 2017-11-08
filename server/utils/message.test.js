var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {

    var from = "Alan";
    var text = "Hello";
    var message = generateMessage(from, text);

    expect(message).toMatchObject({from, text});
    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate the correct location address', () => {
    var from = "Alan";
    var latitude = "123";
    var longitude = "456";

    var message = generateLocationMessage(from, latitude, longitude);

    var expectedUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    expect(message.from).toBe(from);
    expect(message.url).toBe(expectedUrl);
    expect(typeof message.createdAt).toBe('number');
  });
});