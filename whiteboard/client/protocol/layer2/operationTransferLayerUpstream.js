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
const { drawLineUG } = require('../../src/gui-draw.js');
const { addStickyNoteUG, deleteStickyNoteUG, updateStickyNoteUG } = require('../../src/gui-stickynote.js');
const { addImageUG } = require('../../src/gui-image.js');
const { TYPES_L2 } = require("../../../../PDU/layer2/msgDefL2.js");
// const { storeDrawLinesL2, storeAddStickyNotesL2, storeAddImagesL2 } = require("./stateManageLayer.js");
//const { recvUL1 } = require('../layer1/sessionLayerClient.js');
const { onUnDo } = require('../../src/gui-undo.js')
const CryptoJS = require("crypto-js");

const drawLineUL2 = (msgL2) => {
    // TODO: store edition
    // TODO: handle (possible) conflicts
    // TODO: invoke functions form GUI to display the edition
    //storeDrawLinesL2(msgL2);
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var context = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    drawLineUG(
        msgL2.payload.loc.x0,
        msgL2.payload.loc.y0,
        msgL2.payload.loc.x1,
        msgL2.payload.loc.y1,
        msgL2.payload.color,
        msgL2.payload.lineId,
        msgL2.payload.hidden);
};

const unDoLineL2 = (msgL2) => {
    // onUnDoDG(msgL2.lineId)
    // console.log("cur all lines",allDrawLines)
    onUnDo(msgL2.payload.lineId);
};

// const redrawLineUL2 = (msgL2) => {
//     const lineHist = msgL2.payload;
//     //console.log(lineHist);
//     var canvas = document.getElementsByClassName('whiteboard')[0];
//     var context = canvas.getContext('2d');
//     context.clearRect(
//         0,
//         0,
//         context.canvas.clientWidth,
//         context.canvas.clientHeight
//     );
//     var w = canvas.width;
//     var h = canvas.height;
//     for (const line of lineHist) {
//         //console.log(line.hidden)
//         drawLineUG(
//             line.loc.x0,
//             line.loc.y0,
//             line.loc.x1,
//             line.loc.y1,
//             line.color,
//             line.id,
//             line.hidden);
//     };
// };


const addStickyNoteUL2 = (msgL2) => {
    // TODO: store the edition
    // TODO: invoke functions form GUI to display the edition
    //storeAddStickyNotesL2(msgL2);
    addStickyNoteUG(msgL2);
};

const deleteStickyNoteUL2 = (msgL2) => {
    deleteStickyNoteUG(msgL2.payload.id);
}

const updateStickyNoteUL2 = (msgL2) => {
    const note = {
        id: msgL2.payload.id,
        x: msgL2.payload.loc.x,
        y: msgL2.payload.loc.y,
        //text: msgL2.payload.text,
        text: CryptoJS.AES.decrypt(msgL2.payload.text, 'secret key 123').toString(CryptoJS.enc.Utf8),
        zindex: msgL2.payload.loc.zindex,
    };
    console.log(note.text);
    updateStickyNoteUG(msgL2.payload.id, note);
}

const addImageUL2 = (msgL2) => {
    // TODO: store the edition
    // TODO: invoke functions form GUI to display the edition
    // storeAddImagesL2(msgL2);
    console.log(msgL2.payload.loc);
    msgL2.payload.bytes = CryptoJS.AES.decrypt(msgL2.payload.bytes, 'secret key 123').toString(CryptoJS.enc.Utf8);
    console.log(msgL2.payload.bytes);
    addImageUG(msgL2);
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
            //redrawLineUL2(msgL2);
            unDoLineL2(msgL2)
            break;
        case TYPES_L2.STICKYNOTE:
            switch (msgL2.payload.actiontype) {
                case 'add':
                    addStickyNoteUL2(msgL2);
                    break;
                case 'delete':
                    deleteStickyNoteUL2(msgL2);
                    break;
                case 'update':
                    updateStickyNoteUL2(msgL2);
                    break;
                default:
                    console.log("Invalid message type!(L2, client side)");
            }
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