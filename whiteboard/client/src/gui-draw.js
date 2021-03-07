

const { DrawLineContext, getCanvasSizeG } = require('./gui-state.js');

const protocol = require("protocol");

const drawLineDG = (x0, y0, x1, y1, color, id) => {
    doDrawLineG(x0, y0, x1, y1, color);

    x0 /= getCanvasSizeG().width;
    x1 /= getCanvasSizeG().width;
    y0 /= getCanvasSizeG().height;
    y1 /= getCanvasSizeG().height;
    protocol.drawLineDL2(x0, y0, x1, y1, color);
};

// coordinates in the prameters are relative
const drawLineUG = (x0, y0, x1, y1, color, hidden) => {
    console.log(`HIDDEN: ${hidden}`);
    // if (hidden) return;
    const w = getCanvasSizeG().width;
    const h = getCanvasSizeG().height;
    x0 *= w;
    y0 *= h;
    x1 *= w;
    y1 *= h;
    console.log(`drawing!`)
    doDrawLineG(x0, y0, x1, y1, color);
};

const doDrawLineG = (x0, y0, x1, y1, color) => {
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
};

module.exports = {
    drawLineDG, drawLineUG,
    getCanvasSizeG,
};