//const { getMsgL2Template, TYPES_L2 } = require("../../../PDU/layer2/msgDefL2.js");
//const { getCanvasSizeG } = require('./gui-state.js');
//const { generateUniqueId } = require('./gui-config.js');
//const { addStickyNoteDL2 } = require('../protocol/layer2/operationTransferLayerDownstream');
const { storeAddStickyNotesL2, deleteStickyNoteL2, updataStickyNoteL2 } = require('../protocol/layer2/stateManageLayer');


const { addStickyNoteDL2 } = require("protocol");

const addStickyNoteDG = () => {
    const note = {
        id: generateUniqueId(),
        x: Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 400 + 80),
        text: 'Click here to start editing!',
        zindex: 0,
    };

    storeAddStickyNotesL2(note);
    addStickyNoteDL2(note.id, note.x, note.y, 50, 50, note.text, note.zindex);
};

const addStickyNoteUG = (msgL2) => {

    const note = {
        id: msgL2.payload.id,
        x: msgL2.payload.loc.x,
        y: msgL2.payload.loc.y,
        text: msgL2.payload.text,
        zindex: msgL2.payload.loc.zindex,
    };

    storeAddStickyNotesL2(note);
};

const deleteStickyNote = (id) => {
    deleteStickyNoteL2(id);
}

const updateStickyNote = (id, note) => {
    updataStickyNoteL2(id, note);
};

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

module.exports = {
    addStickyNoteDG, deleteStickyNote, updateStickyNote, addStickyNoteUG
}



