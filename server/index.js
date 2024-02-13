const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersOfRoom } = require('./users');
const router = require('./router');

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});
// functionality, such as listening for events, emitting events, and managing connections.
io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersOfRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersOfRoom(user.room) });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
    }
  });
});

app.use(router);
app.use(cors());

server.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
