// Session layer (layer1)

const { recvUL2 } = require("../layer2/operationTransferLayerUpstream.js");
const { setUserid } = require("../layer2/stateManageLayer.js");
const { getMsgL1Template, TYPES_L1 } = require("../../../../PDU/layer1/msgDefL1.js");
const io = require("socket.io-client");
//const { connected } = require("process");

let userid;
let webSocket = null;       // web socket is implemented with Singleton Pattern

const getWebSocket = () => {
    if (webSocket === null) {
        const io = require("socket.io-client");
        webSocket = io("ws://localhost:5000");
        /* webSocket.on("connect", () => {
            console.log('Connect to server!');
        });

        webSocket.on("message", msgL1 => {
            console.log(msgL1);
            recvUL1(msgL1);
        }); */
    }
    return webSocket;
};

/* Connect to the server with web socket
 * Password should be specified.
 * Password should be a string.
 */

const connectDL1 = (pwd, history) => {
    const msgL1 = getMsgL1Template(TYPES_L1.CONNECT);
    msgL1.head.type = 'connect';
    msgL1.head.pwd = pwd.toString();
    const Socket = getWebSocket();
    Socket.send(msgL1);
    recvUL1(Socket, history);
    return Socket;
};

const disconnectDL1 = () => {
    const msgL1 = getMsgL1Template(TYPES_L1.DISCONNECT);
    msgL1.head.type = 'disconnect';
    //const Socket = getWebSocket();
    webSocket.send(msgL1);
    webSocket.off();
    window.location.reload();
};

/*
 * Fill a message and send the message with web socket.
 * Invoked by functions from operation manage layer (layer2)
 */
const sendDL1 = (msgL2) => {
    const msgL1 = getMsgL1Template(TYPES_L1.EDIT);
    msgL1.payload = msgL2;
    const Socket = getWebSocket();
    Socket.send(msgL1);
    recvUL1(Socket);
};

// const socket = getWebSocket();

// if(socket != null) {
//     socket.on('edition', msgL1 => {
//         console.log(msgL1.payload.payload);
//         recvUL1(msgL1);
//     });

// }


/*
 * Callback function triggered on receiving message.
 * Invoke a function from operation manage layer (layer2)
 */
const recvUL1 = (Socket, history) => {
    Socket.on('message', msgL1 => {
        switch (msgL1.head.type) {
            case TYPES_L1.CONNECT:
                if (msgL1.head.userid != null) {
                    // connection successes!
                    userid = setUserid(msgL1.head.userid);
                    //console.log(userid);
                    return true;
                } else {
                    //console.log(msgL1.head.description);
                    alert(msgL1.head.description);
                    history.push('/');
                    Socket.off();
                    return false;
                }
            //break;
            case TYPES_L1.DISCONNECT:
                console.log(msgL1.head.description);
                break;
            case TYPES_L1.EDIT:
                recvUL2(msgL1.payload);
                break;
            default:
                console.log("Invalid message type! (L1, client side)");
        }
    })
};

module.exports = {
    connectDL1, disconnectDL1, sendDL1, recvUL1
};