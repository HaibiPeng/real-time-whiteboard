/*
 * session layer's (layer1) implementation on SERVER side
 */

const { getMsgL1Template, TYPES_L1 } = require("../../../../PDU/layer1/msgDefL1.js");

let pwd = null;
const setPwd = (newpwd) => {
    pwd = newpwd;
};

let MAX_NUM_OF_CLIENTS = 2;
// track the current number of the clients,
// also serves as the generated user id for the client
let currNumClients = 0;
// user id is self-increase
// every time a new user come in, its userId is set as `nextUserId`
let nextUserId = 0;

// the whiteboard client connection handler, not web socket connection
const connectHandler = (socket, msgL1) => {
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
    if (msgL1.head.pwd === pwd) {
        socket.authenticated = true;
        console.log("Authenticated!");
        socket.join('group');

        const msgL1 = getMsgL1Template(TYPES_L1.CONNECT);
        msgL1.head.userid = nextUserId;
        nextUserId += 1;
        currNumClients += 1;
        socket.send(msgL1);

        socket.on("disconnect", (reason) => {
            currNumClients -= 1;
        });
    } else {
        const msgL1 = getMsgL1Template(TYPES_L1.CONNECT);
        msgL1.head.description = 'Password is incorrect!';
        socket.emit('wrongpassword', msgL1);
    }
};

// the whiteboard client disconnection handler, not web socket disconnection
const disconnHandler = (socket, msgL1) => {
    socket.authenticated = false;
    const msgL1Disconn = getMsgL1Template(TYPES_L1.DISCONNECT);
    msgL1Disconn.head.description = "This connection will be closed soon!";
    socket.send(msgL1Disconn);
    socket.disconnect(true);
    console.log("Disconnect!");
};

// handler function for the whiteboard client edition (freehand drawing, adding sticky note, etc.)
const editionHandler = (socket, msgL1) => {
    if (socket.authenticated === true) {
        socket.broadcast.send(msgL1);
    }
};

const init = (socket) => {
    socket.authenticated = false;
};

const recvMsg = (socket) => {
    socket.on('message', (msgL1) => {
        console.log(JSON.stringify(msgL1));
        switch (msgL1.head.type) {
            case TYPES_L1.CONNECT:
                connectHandler(socket, msgL1);
                break;
            case TYPES_L1.DISCONNECT:
                disconnHandler(socket, msgL1);
                break;
            case TYPES_L1.EDIT:
                editionHandler(socket, msgL1);
                break;
            default:
                console.log("Invalid message type! (L1)");
        }
    });
};

module.exports = {
    setPwd,
    recvMsg, init,
};