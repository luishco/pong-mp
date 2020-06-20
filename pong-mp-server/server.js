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
    if (socket.room.owner === socket.user.userName)
      deleteRoom();
    else {
      // TODO: QUANDO JOINAR A SALA, PODER SAIR
    }
  });

  function deleteRoom() {
    rooms = rooms.filter((room) => {
      return room !== socket.room
    })
    socket.leave(socket.room)
    io.emit('update-rooms', rooms)
  }

  socket.on('move-player', (pos) => {
    socket.emit('move-player', pos);
  })

  socket.on('disconnect', () => {
    deleteRoom()
    users = users.filter((user) => {
      return user !== socket.user
    });
    console.log(`a user disconnected`);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});