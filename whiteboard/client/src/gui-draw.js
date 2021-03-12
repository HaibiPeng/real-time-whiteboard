

const { DrawLineContext, getCanvasSizeG } = require('./gui-state.js');

const protocol = require("protocol");


const drawLineDG = (x0, y0, x1, y1, color, line_id, hidden) => {
    if (hidden === true) return;

    doDrawLineG(x0, y0, x1, y1, color);
    if( x0 !== undefined && y0 !== undefined && color !== undefined && x1 !== undefined && y1 !== undefined){
        protocol.allDrawLines.push({x0, y0, x1, y1, color, line_id, hidden})
        console.log("current lines:",  protocol.allDrawLines)
    }

    x0 /= getCanvasSizeG().width;
    x1 /= getCanvasSizeG().width;
    y0 /= getCanvasSizeG().height;
    y1 /= getCanvasSizeG().height;
    protocol.drawLineDL2(x0, y0, x1, y1, color,line_id, hidden);
};

// coordinates in the parameters are relative
const drawLineUG = (x0, y0, x1, y1, color, line_id,hidden) => {
    // console.log(`HIDDEN: ${hidden}`);
    if (hidden === true) return;
    const w = getCanvasSizeG().width;
    const h = getCanvasSizeG().height;
    x0 *= w;
    y0 *= h;
    x1 *= w;
    y1 *= h;
    // console.log(`drawing! now I am`)
    doDrawLineG(x0, y0, x1, y1, color);
    if( x0 !== undefined && y0 !== undefined && color !== undefined && x1 !== undefined && y1 !== undefined){
        protocol.allDrawLines.push({x0, y0, x1, y1, color, line_id, hidden})
        console.log("current lines:",  protocol.allDrawLines)
    }
};

const doDrawLineG = (x0, y0, x1, y1, color) => {
    // console.log("how many func revoked to draw one line")
    const context = DrawLineContext.canvas.getContext('2d');
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
    drawLineDG, drawLineUG,doDrawLineG,
    getCanvasSizeG,
};