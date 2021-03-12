/*
 * State manage layer is a sub-layer of the layer2.
 * It store and manage editions from all clients (including the local client's).
 * It handles the possible conflicts between editions.
 */

let USERID = null;

const setUserid = (userId) => {
    USERID = userId;
    return USERID;
};

const getUserid = async() => {
    return USERID;
};

// TODO: functions to store different editions
let drawLines = []; // [userid2: [], userid2: []]
let drawLineHistory = [];

let allDrawLines = []

//max line history is not used at this time, if needed, it will be added.
// const MAX_UNDO_NUMBER = 10;
let drawLinePointer = -1;
let stickNotes = [];
let images = [];

//store drawline action
function drawLineAction(data) {
    if (drawLineHistory.length - 1 > drawLinePointer) {
        drawLineHistory.splice(drawLinePointer + 1);
    }
    drawLineHistory.push(data);

    drawLinePointer += 1;
}


function getCurAction() {
    return drawLineHistory[drawLinePointer]
}

//get drawlinehistory list
function getDrawLineHistory() {
    return drawLineHistory;
}

//get cur drawlinePointer
function getDrawLinePointer() {
    return drawLinePointer;
}

function unDoDrawLineToDecreasePointer() {
    drawLinePointer -= 1;
}

const storeAddStickyNotesL2 = (msgL2) => {};

const storeAddImagesL2 = (msgL2) => {};

// TODO: functions to detect and handle conflicts, which will be invoked by functions from operation transfer sub-layer

module.exports = {
    setUserid, getUserid,
    drawLineAction,getDrawLineHistory,getDrawLinePointer,unDoDrawLineToDecreasePointer, storeAddStickyNotesL2, storeAddImagesL2, allDrawLines, getCurAction
};