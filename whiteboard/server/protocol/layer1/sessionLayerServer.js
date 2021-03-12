/*
 * session layer's (layer1) implementation on SERVER side
 */

const { getMsgL1Template, TYPES_L1 } = require("../../../../PDU/layer1/msgDefL1.js");
const { TYPES_L2 } = require("../../../../PDU/layer2/msgDefL2.js");
const { getUser, addUser, removeUser, getUsersInRoom } = require('./users.js');

let lineHist = [];

let pwd = null;
const setPwd = (newpwd) => {
    pwd = newpwd;
};

let MAX_NUM_OF_CLIENTS = 10;
// track the current number of the clients,
// also serves as the generated user id for the client
let currNumClients = 0;
// user id is self-increase
// every time a new user come in, its userId is set as `nextUserId`
let nextUserId = 0;

// the whiteboard client connection handler, not web socket connection
const connectHandler = (socket, io, msgL1In) => {
    if (currNumClients >= MAX_NUM_OF_CLIENTS) {
        const msgL1 = getMsgL1Template(TYPES_L1.CONNECT);
        msgL1.head.description = "The current number of clients has reached maximum! Please try again later.";
        socket.send(msgL1);
        const msgL1Disconn = getMsgL1Template(TYPES_L1.DISCONNECT);
        msgL1Disconn.head.description = "This connection will be closed soon!";
        socket.send(msgL1Disconn);
        socket.disconnect(true);
        return;
    }
    if (msgL1In.head.pwd === pwd) {
        socket.authenticated = true;
        console.log("Authenticated!", msgL1In);
        const { user, users } = addUser({ id: socket.id, room: 'group' });
        socket.join('group');

        const msgL1 = getMsgL1Template(TYPES_L1.CONNECT);
        //msgL1In.head.userid = nextUserId;
        if (msgL1In.head.userid  === null){
            msgL1.head.userid = generateUniqueId();
        }else {
            msgL1.head.userid = msgL1In.head.userid;
        }

        //nextUserId += 1;
        currNumClients = users.length;
        console.log(currNumClients);
        socket.emit('connection', { user: 'admin', text: `${user.id}, welcome to the whiteboard` });
        socket.broadcast.to(user.room).emit('connection', { user: 'admin', text: `${user.id} has joinded` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        socket.send(msgL1);

        socket.on("Disconnect", (reason) => {
            const { user, users } = removeUser(socket.id)
            currNumClients = users.length;
        });
    } else {
        const msgL1 = getMsgL1Template(TYPES_L1.CONNECT);
        msgL1.head.description = 'Password is incorrect!';
        socket.send(msgL1);
    }
};

// the whiteboard client disconnection handler, not web socket disconnection
const disconnHandler = (socket, io, msgL1) => {
    socket.authenticated = false;
    const msgL1Disconn = getMsgL1Template(TYPES_L1.DISCONNECT);
    msgL1Disconn.head.description = "This connection will be closed soon!";
    // const { user, users } = removeUser(socket.id)
    // currNumClients = users.length;
    //nextUserId -= 1;
    // console.log(currNumClients);
    socket.send(msgL1Disconn);
    socket.disconnect(true);
    // if (user) {
    //     io.to(user.room).emit('connection', { user: 'admin', text: `${user.id} has left!` })
    //     io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
    //     console.log('We lost a connection!');
    // }
};

// handler function for the whiteboard client edition (freehand drawing, adding sticky note, etc.)
const editionHandler = (socket, io, msgL1) => {
    if (socket.authenticated === true) {
        switch (msgL1.payload.head.type) {
            case TYPES_L2.DRAW:
                // console.log("msgL1.payload.payload: ",msgL1.payload.payload);
                // lineHist.push(msgL1.payload.payload);
                // console.log("line added:", lineHist)
                socket.broadcast.send(msgL1);
                break;
            case TYPES_L2.UNDO:
                socket.broadcast.send(msgL1);
                //console.log(msgL1.payload.payload);
                // const user = getUser(socket.id)[0];
                // for (const line of lineHist) {
                //     if (line.id === msgL1.payload.payload.id) {
                //         // console.log(line.id);
                //         line.hidden = msgL1.payload.payload.hidden;
                //     }
                // }
                // msgL1.payload.payload = lineHist;
                // io.to(user.room).send(msgL1);
                break;
        }
    }
};

const init = (socket) => {
    socket.authenticated = false;
};

const recvMsg = (socket, io) => {
    socket.on('message', (msgL1) => {
        //console.log(JSON.stringify(msgL1));
        switch (msgL1.head.type) {
            case TYPES_L1.CONNECT:
                connectHandler(socket, io, msgL1);
                break;
            case TYPES_L1.DISCONNECT:
                console.log(msgL1);
                disconnHandler(socket, io, msgL1);
                break;
            case TYPES_L1.EDIT:
                editionHandler(socket, io, msgL1);
                break;
            default:
                console.log("Invalid message type! (L1)");
        }
    });
};

function generateUniqueId() {
    const strong = 65535;
    return (
        new Date().getTime().toString(16) +
        "-" +
        Math.floor(strong * Math.random()).toString(16) +
        "-" +
        Math.floor(strong * Math.random()).toString(16) +
        "-" +
        Math.floor(strong * Math.random()).toString(16)
    );
}

module.exports = {
    setPwd,
    recvMsg, init,
};