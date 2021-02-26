// Interaction layer (layer3)

/* This is the top most layer in our whiteboard protocol stack.
 * This layer defines representation of all edition operations, like freehand drawing, adding images, adding sticky notes,
 * undo and redo, etc.
 *
 */

/* The following functions are invoked by GUI.
 * Interfaces exposed to GUI.
 * 'D' is the abbr of Down, which means that the data flow is from the higher layer to the lower layer.
 */

/*
Fill a message, and hand the message to operation manage (layer2)
 */
import { getMsgL3Template } from "../../../../PDU/layer3/msgDefL3.js";
import * as opMngLayer from "../layer2/operationManageLayer.js";
const drawLineDL3 = () => {
    const msgL3 = getMsgL3Template();
    // fill the msgL2 message
    opMngLayer.drawLineDL2(msgL3);
};

const addStickyNoteDL3 = () => {};

const addImageDL3 = () => {};


/* The following functions will be invoked by the operation manage layer (layer2).
 * Interfaces exposed to layer2.
 * 'U' is the abbr of Up, which means that the data flow is from the lower layer to the higher layer.
 * These functions invoke functions from GUI.
 * These functions are called by Operation Manage Layer (layer2).
 */

import * as gui from "../../GUI/gui.js";

const drawLineUL3 = (msgL3) => {
    gui.drawLineG();
};

const addStickyNoteUL3 = (msgL3) => {};

const addImageUL3 = (msgL3) => {};

export {
    drawLineDL3, addImageDL3, addStickyNoteDL3,
    drawLineUL3, addImageUL3, addStickyNoteUL3,
};
