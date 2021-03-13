//const { getMsgL2Template, TYPES_L2 } = require("../../../PDU/layer2/msgDefL2.js");
//const { getCanvasSizeG } = require('./gui-state.js');
//const { generateUniqueId } = require('./gui-config.js');
//const { deleteStickyNoteDL2 } = require('../protocol/layer2/operationTransferLayerDownstream');
const { v4: uuidv4 } = require('uuid');
const { storeAddStickyNotesL2, deleteStickyNoteL2, updateStickyNoteL2 } = require('../protocol/layer2/stateManageLayer');

// eslint-disable-next-line
const protocol = require("protocol");

let note = {};

const addStickyNoteDG = () => {
    note = {
        id: uuidv4(),
        x: Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 400 + 80),
        text: 'Click here to start editing!',
        zindex: 0,
    };

    console.log(1);
    storeAddStickyNotesL2(note);
    protocol.addStickyNoteDL2(note.id, note.x, note.y, 50, 50, note.text, note.zindex);
}

const addStickyNoteUG = (msgL2) => {
    note = {
        id: msgL2.payload.id,
        x: msgL2.payload.loc.x,
        y: msgL2.payload.loc.y,
        text: msgL2.payload.text,
        zindex: msgL2.payload.loc.zindex,
    };
    storeAddStickyNotesL2(note);
};

const deleteStickyNoteDG = (id) => {
    deleteStickyNoteL2(id);
    protocol.deleteStickyNoteDL2(id);
}

const deleteStickyNoteUG = (id) => {
    deleteStickyNoteL2(id);
}

const updateStickyNoteDG = (id, note) => {
    updateStickyNoteL2(id, note);
    protocol.updateStickyNoteDL2(id, note);
};

const updateStickyNoteUG = (id, note) => {
    updateStickyNoteL2(id, note);
};

module.exports = {
     addStickyNoteDG, updateStickyNoteDG, addStickyNoteUG, deleteStickyNoteDG, deleteStickyNoteUG, updateStickyNoteUG
}



