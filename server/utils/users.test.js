const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {

  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: "Alan",
      room: "First room"
    },{
      id: '2',
      name: "Steve",
      room: "Second room"
    },{
      id: '3',
      name: "Brian",
      room: "First room"
    },
  ]
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Alan',
      room: 'This room'
    }
    var resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should return names for First Room', () => {
    var userList = users.getUserList('First room');

    expect(userList).toEqual(['Alan', 'Brian']);
  })

  it('should remove a user', () => {
    var userId = '3';
    var user = users.removeUser(userId);
    expect(user.id).toBe(userId);

    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var userId = '5';
    var user = users.removeUser(userId);
    expect(user).toBeFalsy();

    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var userId = '1';
    var user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    var userId = '4';
    var user = users.getUser(userId);

    expect(user).toBeFalsy();
  })
});