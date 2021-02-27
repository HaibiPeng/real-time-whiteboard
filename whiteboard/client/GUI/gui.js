/*
 * session related functions. These function communicates directly with session layer (layer1)
 */
const connectG = () => {};

const disconnectG = () => {};

/*
 * edition operations.
 */
const drawLineG = (msgL2) => {};

const addStickNoteG = (msgL2) => {};

const addImageG = (msgL2) => {};


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