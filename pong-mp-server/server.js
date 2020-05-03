let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {
  let rooms = [];

  console.log('a user connected');
  console.log(socket.adapter.rooms);

  socket.on('set-user-data', (userData) => {
    socket.user = userData;
  });

  socket.on('create-room', (roomProperties) => {
    this.rooms.push(roomProperties);
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});