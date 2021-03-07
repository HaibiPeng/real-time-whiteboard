/*
 * This file is for GUI configuration!
 * Function to initialize gui is here!
 */

const { drawLineG } = require('./gui-draw.js');
const { DrawLineContext } = require('./gui-state.js');
const protocol = require("protocol");

const actionHistory = [];
let actionPointer = -1;

function onMouseDown(e) {
    DrawLineContext.drawing = true;
    DrawLineContext.x = e.clientX || e.touches[0].clientX;
    DrawLineContext.y = e.clientY || e.touches[0].clientY;
    DrawLineContext.id = generateUniqueId();
}

function onMouseUp(e) {
    if (!DrawLineContext.drawing) { return; }
    DrawLineContext.drawing = false;
    drawLineG(DrawLineContext.x, DrawLineContext.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, DrawLineContext.color, DrawLineContext.id, false, true);
    putAction({ act: 'drawing', id: DrawLineContext.id });
}

function onMouseMove(e) {
    if (!DrawLineContext.drawing) { return; }
    drawLineG(DrawLineContext.x, DrawLineContext.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, DrawLineContext.color, DrawLineContext.id, false, true);
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
    protocol.undoDL2(action);
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

module.exports = {
    initCanvasG,
}