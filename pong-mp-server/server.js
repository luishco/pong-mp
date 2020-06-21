let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let rooms = {};
let users = {};
io.on('connection', (socket) => {
  console.log('a user connected');
  if (Object.keys(rooms).length)
    socket.emit('update-rooms', rooms);
  
  socket.on('set-user-data', (userData) => {
    if (!users[socket.id]) {
      userData.room = null
      users[socket.id] = userData
      socket.user = userData
    } else {
      setUserData()
    }
  });

  socket.on('create-room', (roomProperties) => {
    socket.join(roomProperties.name);
    users[socket.id].room = roomProperties.name;
    roomProperties.owner = socket.id;
    rooms[roomProperties.name] = roomProperties;
    setUserData()
    io.emit('update-rooms', rooms);
  });

  socket.on('join-room', (roomName) => {
    users[socket.id].room = roomName;
    rooms[roomName].players[socket.id] = {
      'status': 'waiting'
    }
    socket.join(roomName);
    setUserData()
  });

  socket.on('move-player', (pos) => {
    socket.broadcast.to(socket.user.room).emit('move-player', pos)
  })

  socket.on('leave-room', () => {
    leaveRoom();
  });

  socket.on('get-rooms', () => {
    socket.emit('update-rooms', rooms)
  });

  socket.on('player-ready', () => {
    console.log(`player ${socket.user.userName} ready!`)
    rooms[socket.user.room].players[socket.id].status = 'ready'
    
    let allReady = (Object.keys(rooms[socket.user.room].players).filter((player) => {
      return rooms[socket.user.room].players[player].status !== 'ready'
    })).length == 0
    
    if(allReady) {
      io.sockets.in(socket.user.room).emit('start-game')
    }
  });


  socket.on('disconnect', () => {
    leaveRoom();
    delete users[socket.id]
    console.log(`a user disconnected`);
  });

  function leaveRoom() {
    if (users[socket.id].room !== null) {
      if (rooms[socket.user.room].owner === socket.id) {
        delete rooms[users[socket.id].room]
      } else {
        rooms = rooms[socket.user.room].players.filter((player) => {
          return player !== users[socket.id].userName
        })
      }
      socket.leave(users[socket.id].room)
      users[socket.id].room = null
      io.emit('update-rooms', rooms)
    }
  }

  function setUserData() {
    socket.user = users[socket.id]
    socket.broadcast.to(socket.id).emit('set-user-data', users[socket.id])
  }

  function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
  }
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});