// Session layer (layer1)

import * as opMngLayer from "../layer2/operationManageLayer.js";

const socket = null;        // web socket

/*
 *
 */
const connectDL1 = () => {};

const disconnectDL1 = () => {};

/*
 * Fill a message and send the message with web socket.
 */
const sendDL1 = (msgL2) => {
    // emit data through socket
};

/*
 * Callback function triggered on receiving message.
 */
const recvUL1 = (msgL1) => {
    const msgL2 = null;
    // extract msgL2 from msgL1
    opMngLayer.recv(msgL2);
};


export { connectDL1, disconnectDL1, sendDL1, recvUL1, };