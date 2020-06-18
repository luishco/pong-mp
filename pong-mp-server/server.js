let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {
  let rooms = [];
  let users = [];

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
    socket.room = roomProperties.name;
    socket.room.owner = socket.user.userName;
    io.emit('update-rooms', roomProperties);
  });

  socket.on('leave-room', () => {
  });

  function deleteRoom() {
    if (socket.room === socket.user.userName) {
      socket.leave(socket.room);
      socket.emit('update-rooms', rooms);
    }
  }

  socket.on('disconnect', () => {
    console.log(`user ${socket.user.userName} disconnected`);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});