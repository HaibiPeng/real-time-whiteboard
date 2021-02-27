/* Operation manage layer (layer2)
 * This is the most complex layer in our protocol stack.
 * This layer stores and manages all operations.
 * It also manages operation conflicts between different clients.
 * It maintain a queue of the most recent operation, used for implementing undo and redo.
*/

/* Store edition of all users separately.
 *
 */
const localEdition = {
    lines: null,     // a list of objects
    images: null,
    stickNotes: null,
};

const editionOfClientX = {
    lines: null,     // a list of objects
    images: null,
    stickNotes: null,
};

const othersEditions = [];   // an array of editions composition, each composition is of the above form

let USERID = null;
const setUserid = (userId) => {
    USERID = userId;
};

const getUserid = () => {
    return USERID;
};

/* The following functions will be invoked by GUI.
 * 'D' is the abbr of Down, which means that the data flow is from the higher layer to the lower layer.
 */

const { getMsgL2Template, TYPESL2 } = require("../../../../PDU/layer2/msgDefL2.js");
const assert = require("assert");

const drawLineDL2 = (x1, y1, x2, y2) => {
    // can only draw when the userid is set, say, connect to the server
    assert(USERID != null);
    const msgL2 = getMsgL2Template(TYPESL2.DRAW);
    // fill msgL2
    msgL2.head.userid = USERID;
    msgL2.payload.loc.x1 = x1;
    msgL2.payload.loc.x2 = x2;
    msgL2.payload.loc.y1 = y1;
    msgL2.payload.loc.y2 = y2;
    // TODO handle conflicts
    sendDL2(msgL2);
};

const addStickyNoteDL2 = (x, y, w, h, text) => {
    const msgL2 = getMsgL2Template(TYPESL2.STICKYNOTE);
    msgL2.head.userid = USERID;
    msgL2.payload.loc.x = x;
    msgL2.payload.loc.y = y;
    msgL2.payload.loc.w = w;
    msgL2.payload.loc.h = h;
    msgL2.payload.text = text;
    sendDL2(msgL2);
};

const addImageDL2 = (x, y, w, h, gray, bytes) => {
    const msgL2 = getMsgL2Template(TYPESL2.ADDIMAGE);
    msgL2.head.userid = USERID;
    msgL2.payload.loc.x = x;
    msgL2.payload.loc.y = y;
    msgL2.payload.loc.w = w;
    msgL2.payload.loc.h = h;
    msgL2.payload.gray = gray;
    msgL2.payload.bytes = bytes;
    sendDL2(msgL2);
};


/* The following functions invoke functions from GUI to display editions.
 * 'U' is the abbr of Up, which means that the data flow is from the lower layer to the higher layer.
 */
const { drawLineG, addStickNoteG, addImageG } = require("../../GUI/gui.js")
const drawLineUL2 = (msgL2) => {
    // TODO: store edition
    // TODO: handle (possible) conflicts
    // TODO: invoke functions form GUI to display the edition
    drawLineG(
        msgL2.payload.loc.x1,
        msgL2.payload.loc.y1,
        msgL2.payload.loc.x2,
        msgL2.payload.loc.y2,
        msgL2.payload.color,
        );
};

const addStickyNoteUL2 = (msgL2) => {
    // TODO: store the edition
    // TODO: invoke functions form GUI to display the edition
    addStickNoteG(
        msgL2.payload.loc.x,
        msgL2.payload.loc.y,
        msgL2.payload.loc.w,
        msgL2.payload.loc.h,
        msgL2.payload.text,
    );
};

const addImageUL2 = (msgL2) => {
    // TODO: store the edition
    // TODO: invoke functions form GUI to display the edition
    addImageG(
        msgL2.payload.loc.x,
        msgL2.payload.loc.y,
        msgL2.payload.loc.w,
        msgL2.payload.loc.h,
        msgL2.payload.gray,
        msgL2.payload.bytes,
    );
};

// TODO: other edition-related functions

/*
 * The only entrance for sending data out.
 * Will be invoked by any functions that intend to send message.
 * Will invoke the 'send' function of the session layer (layer1).
 */
var { sendDL1 } = require("../layer1/sessionLayerClient.js");
const sendDL2 = (msgL2) => {
    sendDL1(msgL2);
};

/*
 * The only entrance for receiving data in.
 * Invoke function like drawLineUL2, addStickyNoteUL2, etc according to different operation parsed from
  the message.
 */
const recvUL2 = (msgL2) => {
    // invoke drawLineUL2, addStickyNoteUL2, etc. according to edition type
    switch (msgL2.head.type) {
        case TYPESL2.DRAW:
            drawLineUL2(msgL2);
            break;
        case TYPESL2.STICKYNOTE:
            addStickyNoteUL2(msgL2);
            break;
        case TYPESL2.ADDIMAGE:
            addImageUL2(msgL2);
            break;
        default:
            console.log("Invalid message type!(L2, client side)");
    }
};

module.exports = {
    setUserid, getUserid,
    drawLineDL2, addImageDL2, addStickyNoteDL2,
    drawLineUL2, addImageUL2, addStickyNoteUL2,
    recvUL2,
};