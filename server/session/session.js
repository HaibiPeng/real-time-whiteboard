const { getUser, addUser, removeUser, getUsersInRoom } = require('./users.js');

const Join = (socket, io) => {

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) return callback(error);

        console.log('We have a new connection!');
        socket.join(user.room)

        socket.emit('message', { user: 'admin', text: `${user.username}, welcome to the whiteboard` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.username} has joinded` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    });
};

const Disconnect = (socket, io) => {
    socket.on('disconnected', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.username} has left!` })
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
            console.log('We lost a connection!');
        }
    })
}

module.exports =  { Join, Disconnect };