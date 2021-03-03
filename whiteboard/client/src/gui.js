/*
 * session related functions. These function communicates directly with session layer (layer1)
 */
const connectG = () => {};

const disconnectG = () => {};

/*
 * edition operations.
 */
const drawLineG = (context, x0, y0, x1, y1, color, id, hidden) => {
    if (hidden) return;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    if (color === 'white') {
        context.lineWidth = 50;
    } else {
        context.lineWidth = 3;
    }
    context.stroke();
    context.closePath();
};

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