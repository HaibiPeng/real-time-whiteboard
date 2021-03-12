
const { DrawLineContext, getCanvasSizeG } = require('./gui-state.js');

const protocol = require("protocol");

const { allDrawLines } = require("../protocol/layer2/stateManageLayer");

const drawLineDG = (x0, y0, x1, y1, color, line_id, hidden) => {
    if (hidden === true) return;
    //console.log(color);
    doDrawLineG(x0, y0, x1, y1, color);

    // if (x0 !== undefined && y0 !== undefined && color !== undefined && x1 !== undefined && y1 !== undefined) {
    //     allDrawLines.push({ x0, y0, x1, y1, color, line_id, hidden })
    //     //console.log("current lines:",  allDrawLines)
    // }
    allDrawLines.push({ x0, y0, x1, y1, color, line_id, hidden })
    //console.log(allDrawLines);

    x0 /= getCanvasSizeG().width;
    x1 /= getCanvasSizeG().width;
    y0 /= getCanvasSizeG().height;
    y1 /= getCanvasSizeG().height;
    protocol.drawLineDL2(x0, y0, x1, y1, color, line_id, hidden);
};

// coordinates in the prameters are relative
const drawLineUG = (x0, y0, x1, y1, color, line_id, hidden) => {
    //console.log(`HIDDEN: ${hidden}`);
    if (hidden === true) return;
    const w = getCanvasSizeG().width;
    const h = getCanvasSizeG().height;
    x0 *= w;
    y0 *= h;
    x1 *= w;
    y1 *= h;
    //console.log(`drawing!`)
    //console.log(allDrawLines);
    doDrawLineG(x0, y0, x1, y1, color);
    // if (x0 !== undefined && y0 !== undefined && color !== undefined && x1 !== undefined && y1 !== undefined) {
    //     allDrawLines.push({ x0, y0, x1, y1, color, line_id, hidden })
    //     //console.log("current lines:",  protocol.allDrawLines)
    // }
    allDrawLines.push({ x0, y0, x1, y1, color, line_id, hidden })
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
    getCanvasSizeG, doDrawLineG
};