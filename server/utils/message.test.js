var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {

    var from = "Alan";
    var text = "Hello";
    var message = generateMessage(from, text);

    expect(message).toMatchObject({from, text});
    expect(typeof message.createdAt).toBe('number');
  })
});