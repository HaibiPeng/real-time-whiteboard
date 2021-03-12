//const protocol = require("protocol");
const { doDrawLineG } = require("./gui-draw.js")
const { allDrawLines } = require('../protocol/layer2/stateManageLayer');

const onUnDoDG = (line_id) => {
    for (let line of allDrawLines) {
        if (line.line_id === line_id) {
            line.hidden = true;
        }
    }
    //console.log("after undo",protocol.allDrawLines)
    redraw();
}

const redraw = () => {
    const canvas = document.getElementsByClassName('whiteboard')[0];
    const context = canvas.getContext('2d');
    context.clearRect(
        0,
        0,
        context.canvas.clientWidth,
        context.canvas.clientHeight
    );
    //console.log(allDrawLines);
    for (let line of allDrawLines) {
        //console.log("cur redraw line:",line)
        if (line.hidden !== true) {
            doDrawLineG(line.x0, line.y0, line.x1, line.y1, line.color)
        }
    }
}

module.exports = {
    onUnDoDG
}