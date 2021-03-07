

const { DrawLineContext, getCanvasSizeG } = require('./gui-state.js');

const protocol = require("protocol");

function drawLineG(x0, y0, x1, y1, color, id, hidden, downstream = false) {
    if (hidden) return;

    var context = DrawLineContext.canvas.getContext('2d');
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

    if (!downstream) { return; }    // if upstream, do not need to broadcast the edition

    x0 /= getCanvasSizeG().width;
    x1 /= getCanvasSizeG().width;
    y0 /= getCanvasSizeG().height;
    y1 /= getCanvasSizeG().height;
    protocol.drawLineDL2(x0, y0, x1, y1, color);
}

module.exports = {
    drawLineG,
    getCanvasSizeG,
};