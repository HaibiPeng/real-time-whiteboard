/*
 * session related functions. These function communicates directly with session layer (layer1)
 */
const connectG = () => {};

const disconnectG = () => {};

/*
 * edition operations.
 */
const drawLineG = (x1, y1, x2, y2, color) => {};

const addStickNoteG = (x, y, w, h, text) => {};

const addImageG = (x, y, w, h, gray, bytes) => {};


/*
 * Action listeners/handlers can also be implemented here.
 * OnMouseDown
 * OnMouseUp
 * etc.
 */

module.exports = {
    connectG, disconnectG,
    drawLineG, addImageG, addStickNoteG,
}