/* The downstream part of the operation transfer layer, which is a sub-layer of the layer-2
 * Layer-2 is the most complex layer in our protocol stack.
 * The layer-2 stores and manages all operations.
 * It also manages operation conflicts between different clients.
 * It maintains a queue of the most recent operation, used for implementing undo and redo.
 * Layer-2 has two sub-layers: the operation transfer layer and state manage layer
*/

/* The following functions will be invoked by GUI.
 * 'D' is the abbr of Down, which means that the data flow is from the higher layer to the lower layer.
 */

const { drawLineG, addStickNoteG, addImageG } = require("../../src/gui.js");
const { getMsgL2Template, TYPES_L2 } = require("../../../../PDU/layer2/msgDefL2.js");
const { getUserid } = require("./stateManageLayer.js");
const { storeDrawLinesL2, storeAddStickyNotesL2, storeAddImagesL2 } = require("./stateManageLayer.js");
const assert = require("assert");
const { connectDL1, disconnectDL1 } = require('../layer1/sessionLayerClient.js');

const connectDL2 = (password, history) => {
    return connectDL1(password, history);
};

const disconnectDL2 = () => {
    disconnectDL1();
};

const actionHistory = [];
let actionPointer = -1;

const drawLineDL2 = (userid) => {
    // can only draw when the userid is set, say, connect to the server
    assert(userid != null);
    const msgL2 = getMsgL2Template(TYPES_L2.DRAW);
    msgL2.head.userid = userid;
    // fill msgL2
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var colors = document.getElementsByClassName('color');
    var context = canvas.getContext('2d');
    var eraseIcon = document.getElementById('erase');
    var undoIcon = document.getElementById('undo');

    eraseIcon.addEventListener('click', function () {
        current.color = 'white';
    });

    undoIcon.addEventListener('click', function () {
        onUndo();
    });

    window.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && !drawing) {
            if (event.key === "z") {
                onUndo();
            };
        };
    });

    function putAction(data) {
        if (actionHistory.length - 1 > actionPointer) {
            actionHistory.splice(actionPointer + 1);
        }
        actionHistory.push(data);
        actionPointer += 1;
    };

    function onUndo() {
        if (actionPointer < 0) {
            return;
        }
        const action = actionHistory[actionPointer];
        actionPointer -= 1;
        undoDL2(action);
        //Socket.emit("undo", { id: action.id, hidden: true });
    }

    var current = {
        color: 'black'
    };
    var drawing = false;

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

    function onMouseDown(e) {
        drawing = true;
        current.x = e.clientX || e.touches[0].clientX;
        current.y = e.clientY || e.touches[0].clientY;
        current.id = generateUniqueId();
    }

    function onMouseUp(e) {
        if (!drawing) { return; }
        drawing = false;
        drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, current.id, false, true);
        putAction({ act: 'drawing', id: current.id });
        //console.log(current.id);
    }

    function onMouseMove(e) {
        if (!drawing) { return; }
        drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, current.id, false, true);
        current.x = e.clientX || e.touches[0].clientX;
        current.y = e.clientY || e.touches[0].clientY;
    }

    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
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
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', onResize, false);
    onResize();

    function drawLine(x0, y0, x1, y1, color, id, hidden, emit) {
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

        if (!emit) { return; }
        var w = canvas.width;
        var h = canvas.height;

        msgL2.head.userid = getUserid();
        msgL2.payload.loc.x0 = x0 / w;
        msgL2.payload.loc.x1 = x1 / w;
        msgL2.payload.loc.y0 = y0 / h;
        msgL2.payload.loc.y1 = y1 / h;
        msgL2.payload.color = color;
        msgL2.payload.hidden = hidden;
        msgL2.payload.id = id;
    
        sendDL2(msgL2);
    }
};

const undoDL2 = (action) => {
    const msgL2 = getMsgL2Template(TYPES_L2.UNDO);
    //msgL2.head.userid = Socket.id;
    msgL2.payload.id = action.id;
    msgL2.payload.hidden = true;
    sendDL2(msgL2);
};

const addStickyNoteDL2 = (x, y, w, h, text) => {
    const msgL2 = getMsgL2Template(TYPES_L2.STICKYNOTE);
    msgL2.head.userid = getUserid();
    msgL2.payload.loc.x = x;
    msgL2.payload.loc.y = y;
    msgL2.payload.loc.w = w;
    msgL2.payload.loc.h = h;
    msgL2.payload.text = text;
    addStickNoteG(msgL2);
    storeAddStickyNotesL2(msgL2);
    sendDL2(msgL2);
};

const addImageDL2 = (x, y, w, h, gray, bytes) => {
    const msgL2 = getMsgL2Template(TYPES_L2.ADDIMAGE);
    msgL2.head.userid = getUserid();
    msgL2.payload.loc.x = x;
    msgL2.payload.loc.y = y;
    msgL2.payload.loc.w = w;
    msgL2.payload.loc.h = h;
    msgL2.payload.gray = gray;
    msgL2.payload.bytes = bytes;
    addImageG(msgL2);
    storeAddImagesL2(msgL2);
    sendDL2(msgL2);
};

var { sendDL1 } = require("../layer1/sessionLayerClient.js");
const sendDL2 = (msgL2) => {
    sendDL1(msgL2);
};

module.exports = {
    connectDL2, disconnectDL2, drawLineDL2, addImageDL2, addStickyNoteDL2,
};