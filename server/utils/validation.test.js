const expect = require('expect');

var {isRealString} = require('./validation');

describe('Test isRealString function', () => {
  it('should reject non-string values', () => {
    var nonString = 12345;
    var result = isRealString(nonString);

    expect(result).toBe(false);
  });
  
  it('should reject string with only spaces', () => {
    var spaces = "     ";
    var result = isRealString(spaces);

    expect(result).toBe(false);
  })

  it('should allow string with non-space characters', () => {
      var nonSpaceCharacters = "abcddefg";
      var result = isRealString(nonSpaceCharacters);

      expect(result).toBe(true);
  });
});