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
let stickNotes = [];
let images = [];

const storeDrawLinesL2 = (msgL2) => {
    // TODO, STEP 1
};

const storeAddStickyNotesL2 = (msgL2) => {};

const storeAddImagesL2 = (msgL2) => {};

// TODO: functions to detect and handle conflicts, which will be invoked by functions from operation transfer sub-layer

module.exports = {
    setUserid, getUserid,
    storeDrawLinesL2, storeAddStickyNotesL2, storeAddImagesL2,
};