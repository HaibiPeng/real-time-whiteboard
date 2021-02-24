//const { getUser } = require('../session/users.js');

const Drawing = (socket) => {
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
};

module.exports = { Drawing };