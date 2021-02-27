/* The downstream part of the operation transfer layer, which is a sub-layer of the layer-2
 * Layer-2 is the most complex layer in our protocol stack.
 * The layer-2 stores and manages all operations.
 * It also manages operation conflicts between different clients.
 * It maintains a queue of the most recent operation, used for implementing undo and redo.
 * Layer-2 has two sub-layers: the operation transfer layer and state manage layer
*/

/* The following functions will be invoked by GUI.
 * 'D' is the abbr of Down, which means that the data flow is from the higher layer to the lower layer.
 */

const { drawLineG, addStickNoteG, addImageG } = require("../../GUI/gui.js");
const { getMsgL2Template, TYPES_L2 } = require("../../../../PDU/layer2/msgDefL2.js");
const { getUserid } = require("./stateManageLayer.js");
const { storeDrawLinesL2, storeAddStickyNotesL2, storeAddImagesL2 } = require("./stateManageLayer.js");
const assert = require("assert");

const drawLineDL2 = (x1, y1, x2, y2) => {
    // can only draw when the userid is set, say, connect to the server
    assert(getUserid() != null);
    const msgL2 = getMsgL2Template(TYPES_L2.DRAW);
    // fill msgL2
    msgL2.head.userid = getUserid();
    msgL2.payload.loc.x1 = x1;
    msgL2.payload.loc.x2 = x2;
    msgL2.payload.loc.y1 = y1;
    msgL2.payload.loc.y2 = y2;
    // TODO handle conflicts
    drawLineG(msgL2);
    storeDrawLinesL2(msgL2);
    sendDL2(msgL2);
};

const addStickyNoteDL2 = (x, y, w, h, text) => {
    const msgL2 = getMsgL2Template(TYPES_L2.STICKYNOTE);
    msgL2.head.userid = getUserid();
    msgL2.payload.loc.x = x;
    msgL2.payload.loc.y = y;
    msgL2.payload.loc.w = w;
    msgL2.payload.loc.h = h;
    msgL2.payload.text = text;
    addStickNoteG(msgL2);
    storeAddStickyNotesL2(msgL2);
    sendDL2(msgL2);
};

const addImageDL2 = (x, y, w, h, gray, bytes) => {
    const msgL2 = getMsgL2Template(TYPES_L2.ADDIMAGE);
    msgL2.head.userid = getUserid();
    msgL2.payload.loc.x = x;
    msgL2.payload.loc.y = y;
    msgL2.payload.loc.w = w;
    msgL2.payload.loc.h = h;
    msgL2.payload.gray = gray;
    msgL2.payload.bytes = bytes;
    addImageG(msgL2);
    storeAddImagesL2(msgL2);
    sendDL2(msgL2);
};

var { sendDL1 } = require("../layer1/sessionLayerClient.js");
const sendDL2 = (msgL2) => {
    sendDL1(msgL2);
};

module.exports = {
    drawLineDL2, addImageDL2, addStickyNoteDL2,
};