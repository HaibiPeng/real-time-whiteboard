/* The upstream part of the operation transfer layer, which is a sub-layer of the layer-2
 * Layer-2 is the most complex layer in our protocol stack.
 * The layer-2 stores and manages all operations.
 * It also manages operation conflicts between different clients.
 * It maintains a queue of the most recent operation, used for implementing undo and redo.
 * Layer-2 has two sub-layers: the operation transfer layer and state manage layer
*/

/* The following functions invoke functions from GUI to display editions.
 * 'U' is the abbr of Up, which means that the data flow is from the lower layer to the higher layer.
 */
const { drawLineG, addStickNoteG, addImageG } = require("../../src/gui.js");
const { TYPES_L2 } = require("../../../../PDU/layer2/msgDefL2.js");
const { storeDrawLinesL2, storeAddStickyNotesL2, storeAddImagesL2 } = require("./stateManageLayer.js");
const { recvUL1 } = require('../layer1/sessionLayerClient.js');

const drawLineUL2 = (msgL2) => {
    // TODO: store edition
    // TODO: handle (possible) conflicts
    // TODO: invoke functions form GUI to display the edition
    //storeDrawLinesL2(msgL2);
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var context = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    drawLineG(context, msgL2.payload.loc.x0 * w, msgL2.payload.loc.y0 * h, msgL2.payload.loc.x1 * w, msgL2.payload.loc.y1 * h, 
        msgL2.payload.color, msgL2.payload.id, msgL2.payload.hidden);
};

const redrawLineUL2 = (msgL2) => {
    const lineHist = msgL2.payload;
    console.log(lineHist);
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var context = canvas.getContext('2d');
    context.clearRect(
        0,
        0,
        context.canvas.clientWidth,
        context.canvas.clientHeight
    );
    var w = canvas.width;
    var h = canvas.height;
    for (const line of lineHist) {
        //console.log(line.hidden)
        drawLineG(context, line.loc.x0 * w, line.loc.y0 * h, line.loc.x1 * w, line.loc.y1 * h,
            line.color, line.id, line.hidden);
    };
};

const addStickyNoteUL2 = (msgL2) => {
    // TODO: store the edition
    // TODO: invoke functions form GUI to display the edition
    storeAddStickyNotesL2(msgL2);
    addStickNoteG(msgL2);
};

const addImageUL2 = (msgL2) => {
    // TODO: store the edition
    // TODO: invoke functions form GUI to display the edition
    storeAddImagesL2(msgL2);
    addImageG(msgL2);
};

// TODO: other edition-related functions

/*
 * The only entrance for receiving data in.
 * Invoke function like drawLineUL2, addStickyNoteUL2, etc according to different operation parsed from
  the message.
 */
const recvUL2 = (msgL2) => {
    // invoke drawLineUL2, addStickyNoteUL2, etc. according to edition type
    switch (msgL2.head.type) {
        case TYPES_L2.DRAW:
            drawLineUL2(msgL2);
            break;
        case TYPES_L2.UNDO:
            redrawLineUL2(msgL2);
            break;
        case TYPES_L2.STICKYNOTE:
            addStickyNoteUL2(msgL2);
            break;
        case TYPES_L2.ADDIMAGE:
            addImageUL2(msgL2);
            break;
        default:
            console.log("Invalid message type!(L2, client side)");
    }
};

module.exports = {
    drawLineUL2, addImageUL2, addStickyNoteUL2,
    recvUL2,
};