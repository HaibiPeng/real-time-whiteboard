/* Operation manage layer (layer2)
 * This is the most complex layer in our protocol stack.
 * This layer stores and manages all operations.
 * It also manages operation conflicts between different clients.
 * It maintain a queue of the most recent operation, used for implementing undo and redo.
*/

/* Store edition of all users separately.
 *
 */
const userId = null;
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

/* The following functions will be invoked by GUI.
 * Interfaces exposed to interaction layer (layer3).
 * 'D' is the abbr of Down, which means that the data flow is from the higher layer to the lower layer.
 */

import { getMsgL2Template } from "../../../../PDU/layer2/msgDefL2.js";
import * as snLayer from "../layer1/sessionLayer.js";
import * as ntLayer from "../layer3/interactionLayer.js";

const drawLineDL2 = (msgL3) => {
    const msgL2 = getMsgL2Template();
    // fill msgL2
    // handle conflicts
    send(msgL2);
};

const addStickyNoteDL2 = (msgL1) => {};

const addImageDL2 = (msgL1) => {};


/* The following functions will be invoked by the operation manage layer (layer2).
 * Interfaces exposed to layer1.
 * 'U' is the abbr of Up, which means that the data flow is from the lower layer to the higher layer.
 */
const drawLineUL2 = (msgL2) => {
    // store edition
    // handle (possible) conflicts
    const msgL3 = null;
    // extract msgL3 from msgL2
    ntLayer.drawLineUL3(msgL3);
};

const addStickyNoteUL2 = (msgL2) => {};

const addImageUL2 = (msgL2) => {};

/*
 * The only entrance for sending data out.
 * Will be invoked by any functions that intend to send message.
 * Will invoke the 'send' function of the session layer (layer1).
 */
const send = (msgL2) => {
    snLayer.sendDL1(msgL2)
};

/*
 * The only entrance for receiving data in.
 * Invoke function like drawLineUL2, addStickyNoteUL2, etc according to different operation parsed from
  the message.
 */
const recv = (msgL2) => {
    // invoke drawLineUL2, addStickyNoteUL2, etc. according to edition type
};

export {
    drawLineDL2, addImageDL2, addStickyNoteDL2,
    drawLineUL2, addImageUL2, addStickyNoteUL2,
    send, recv,
};