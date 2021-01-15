const socketIo = require('socket.io');

let io;

const handleSocketIo = (server) => {
  io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Has connection');

    socket.on('disconnect', () => {
      console.log('User has left');
    });
  });
};

module.exports = { handleSocketIo, io };
