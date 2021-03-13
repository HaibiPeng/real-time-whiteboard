/*
 * This file is for GUI configuration!
 * Function to initialize gui is here!
 */

const { v4: uuidv4 } = require('uuid');
const { drawLineDG } = require('./gui-draw.js');
const { addStickyNoteDG } = require('./gui-stickynote.js');
const { DrawLineContext } = require('./gui-state.js');
const protocol  = require("protocol");
const { onUnDo } = require('./gui-undo.js');
const { getDrawLinePointer, drawLineAction, getCurAction, unDoDrawLineToDecreasePointer } = require('../protocol/layer2/stateManageLayer');

function onMouseDown(e) {
    DrawLineContext.drawing = true;
    DrawLineContext.x = e.clientX || e.touches[0].clientX;
    DrawLineContext.y = e.clientY || e.touches[0].clientY;
    DrawLineContext.id = uuidv4();
}

function onMouseUp(e) {
    if (!DrawLineContext.drawing) { return; }
    DrawLineContext.drawing = false;
    drawLineDG(
        DrawLineContext.x,
        DrawLineContext.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        DrawLineContext.color,
        DrawLineContext.id,
        DrawLineContext.hidden);
    //putAction({ act: 'drawing', id: DrawLineContext.id });
    drawLineAction({ act: "drawLine", id: DrawLineContext.id })
}

function onMouseMove(e) {
    if (!DrawLineContext.drawing) { return; }
    drawLineDG(
        DrawLineContext.x,
        DrawLineContext.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        DrawLineContext.color,
        DrawLineContext.id, 
        DrawLineContext.hidden);
    DrawLineContext.x = e.clientX || e.touches[0].clientX;
    DrawLineContext.y = e.clientY || e.touches[0].clientY;
}

function onColorUpdate(e) {
    DrawLineContext.color = e.target.className.split(' ')[1];
}


function onUndo() {
    //old version
    // console.log("trying undo")
    // console.log("before actionHistory: ", actionHistory)
    // if (actionPointer < 0) {
    //     return;
    // }
    // const action = actionHistory[actionPointer];
    // actionPointer -= 1;
    // console.log("after actionHistory: ", actionHistory)
    // protocol.undoDL2(action);
    // // Socket.emit("undo", { id: action.id, hidden: true });

    // new version of onUndo
    // console.log("why not undo")
    if (getDrawLinePointer() < 0) {
        console.log("You have no line to undo")
        return;
    }
    const action = getCurAction();
    unDoDrawLineToDecreasePointer();
    //console.log("cur action:", action);
    // action.id is the id of last draw line
    onUnDo(action.id);
    protocol.undoDL2(action);
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
    var stickynoteIcon = document.getElementById('stickynote');

    eraseIcon.addEventListener('click', function () {
        DrawLineContext.color = 'white';
    });

    undoIcon.addEventListener('click', function () {
        onUndo();
    });

    stickynoteIcon.addEventListener('click', function () {
        addStickyNoteDG();
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
    initCanvasG, generateUniqueId
}