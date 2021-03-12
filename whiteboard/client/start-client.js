// TEST SCRIPT for the client side session layer

const { connectDL1, disconnectDL1, sendDL1 } = require('./protocol/layer1/sessionLayerClient.js');

connectDL1("1234");
// connectDL1("123456");


// only for testing!
const { drawLineDL2 } = require("./protocol/layer2/operationTransferLayerDownstream.js");
const { getUserid } = require("./protocol/layer2/stateManageLayer.js");

console.log("is reconnnect",getUserid())
// sleep for 3 seconds, wait the USERID to be set
const sleep = require("system-sleep");
sleep(1000);
if (getUserid() != null) {
    drawLineDL2(1, 2, 3, 4);    // error will occur! TypeError: sendDL1 is not a function
}

// const { getMsgL2Template, TYPES_L2 } = require('../../PDU/layer2/msgDefL2.js');
// const msgL2 = getMsgL2Template(TYPES_L2.DRAW);
// msgL2.head.userid = getUserid();
// msgL2.payload.loc.x1 = 1;
// msgL2.payload.loc.y1 = 2;
// msgL2.payload.loc.x2 = 3;
// msgL2.payload.loc.y2 = 4;
// sendDL1(msgL2);