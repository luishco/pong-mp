let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let rooms = [];
let users = [];
io.on('connection', (socket) => {
  // INITIAL SETUP
  console.log('a user connected');
  if (rooms.length)
    socket.emit('update-rooms', rooms);
  
  socket.on('set-user-data', (userData) => {
    socket.user = userData;
    users.push(socket.user);
  });

  socket.on('create-room', (roomProperties) => {
    socket.leave(socket.room);
    socket.room = roomProperties;
    socket.room.owner = socket.user.userName;
    rooms.push(socket.room);
    io.emit('update-rooms', rooms);
  });

  socket.on('leave-room', () => {
    console.log('leave-room')
    if (socket.room.owner === socket.user.userName)
      deleteRoom();
    else {
      rooms.filter((room) => {
      })
    }
  });

  function deleteRoom() {
    rooms = rooms.filter((room) => {
      return room !== socket.room
    })
    socket.leave(socket.room)
    io.emit('update-rooms', rooms)
  }

  socket.on('disconnect', () => {
    deleteRoom()
    console.log(`user ${socket.user.userName} disconnected`);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});