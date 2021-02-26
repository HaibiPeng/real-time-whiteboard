const { getUser } = require('../session/users.js');
let lineHist = [];

const Drawing = (socket) => {
    socket.on('drawing', (data) => {
        //const user = getUser(socket.id)[0];
        //console.log(`${user.username} is drawing`);
        //console.log(data.id, data.hidden);
        lineHist.push(data);
        socket.broadcast.emit('drawing', data);
    });
};

const Undo = (socket, io) => {
    socket.on("hideLine", (data) => {
        const user = getUser(socket.id)[0];
        console.log(`${user.username} has undone his/her action`);
        for (const line of lineHist) {
            if (line.id === data.id) {
                //console.log(line.id);
                line.hidden = data.hidden;
            }
        }
        io.to(user.room).emit("redraw", { lineHist: lineHist });
    });
};

module.exports = { Drawing, Undo };