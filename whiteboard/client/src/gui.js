/*
 * session related functions. These function communicates directly with session layer (layer1)
 */
const { drawLineDL2, undoDL2 } = require("../protocol/layer2/operationTransferLayerDownstream.js");
console.log(`drawLineDL2 is: ${drawLineDL2}`);
console.log(`undoDL2 is: ${undoDL2}`);
const connectG = () => {};

const disconnectG = () => {};

// ***************** META DATA BEGIN *************
const DrawLineContext = {
    canvas: null,
    color: null,
    x: null,
    y: null,
    drawing: false,
    id: null,
};

const getCanvasSizeG = () => {
    const canvas = DrawLineContext.canvas;
    return { width: canvas.width, height: canvas.height };
};

const actionHistory = [];
let actionPointer = -1;

// ***************** META DATA ENDS *************

function onMouseDown(e) {
    DrawLineContext.drawing = true;
    DrawLineContext.x = e.clientX || e.touches[0].clientX;
    DrawLineContext.y = e.clientY || e.touches[0].clientY;
    DrawLineContext.id = generateUniqueId();
}

function onMouseUp(e) {
    if (!DrawLineContext.drawing) { return; }
    DrawLineContext.drawing = false;
    drawLine(DrawLineContext.x, DrawLineContext.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, DrawLineContext.color, DrawLineContext.id, false, true);
    putAction({ act: 'drawing', id: DrawLineContext.id });
}

function onMouseMove(e) {
    if (!DrawLineContext.drawing) { return; }
    drawLine(DrawLineContext.x, DrawLineContext.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, DrawLineContext.color, DrawLineContext.id, false, true);
    DrawLineContext.x = e.clientX || e.touches[0].clientX;
    DrawLineContext.y = e.clientY || e.touches[0].clientY;
}

function onColorUpdate(e) {
    DrawLineContext.color = e.target.className.split(' ')[1];
}

function putAction(data) {
    if (actionHistory.length - 1 > actionPointer) {
        actionHistory.splice(actionPointer + 1);
    }
    actionHistory.push(data);
    actionPointer += 1;
}

function onUndo() {
    if (actionPointer < 0) {
        return;
    }
    const action = actionHistory[actionPointer];
    actionPointer -= 1;
    undoDL2(action);
    //Socket.emit("undo", { id: action.id, hidden: true });
}

// limit the number of events per second
function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function () {
        var time = new Date().getTime();

        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    };
}

function generateUniqueId() {
    const strong = 65535;
    return (
        new Date().getTime().toString(16) +
        "-" +
        Math.floor(strong * Math.random()).toString(16) +
        "-" +
        Math.floor(strong * Math.random()).toString(16) +
        "-" +
        Math.floor(strong * Math.random()).toString(16)
    );
}

function onResize() {
    DrawLineContext.canvas.width = window.innerWidth;
    DrawLineContext.canvas.height = window.innerHeight;
}

const initCanvasG = () => {
    var colors = document.getElementsByClassName('color');
    var eraseIcon = document.getElementById('erase');
    var undoIcon = document.getElementById('undo');

    eraseIcon.addEventListener('click', function () {
        DrawLineContext.color = 'white';
    });

    undoIcon.addEventListener('click', function () {
        onUndo();
    });

    window.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && !DrawLineContext.drawing) {
            if (event.key === "z") {
                onUndo();
            }
        }
    });

    const canvas = document.getElementsByClassName('whiteboard')[0];
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    //Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', onColorUpdate, false);
    }
    window.addEventListener('resize', onResize, false);

    DrawLineContext.canvas = canvas;
    onResize();
    console.log("CANVAS INITILIZED!");
};

function drawLine(x0, y0, x1, y1, color, id, hidden, emit) {
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

    if (!emit) { return; }

    x0 /= getCanvasSizeG().width;
    x1 /= getCanvasSizeG().width;
    y0 /= getCanvasSizeG().height;
    y1 /= getCanvasSizeG().height;
    console.log("DRAWLINE: is");
    console.log(drawLineDL2);
    drawLineDL2(x0, y0, x1, y1, color);
}

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
    getCanvasSizeG, initCanvasG,
}