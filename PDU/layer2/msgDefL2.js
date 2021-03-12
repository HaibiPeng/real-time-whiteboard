// Message definition of layer 2, say, the operation management layer
// PDUs are defined by functions

// enumeration of 'type'
const TYPES_L2 = {
    DRAW: 'draw',
    UNDO: 'undo',
    STICKYNOTE: 'stickyNote',
    ADDIMAGE: 'addImage',
};

const getMsgL2TemplateDraw = () => {
    const msgL2 = {
        head: {
            type: 'draw',
            userid: null,
        },
        payload: {
            loc: {
                x0: null,
                y0: null,
                x1: null,
                y1: null,
            },
            color: null,
            hidden: null,
            lineId: null
        },
    };
    return msgL2;
};

const getMsgL2TemplateUndo = () => {
    const msgL2 = {
        head: {
            type: 'undo',
            userid: null,
        },
        payload: {
            id: null,
            hidden: null
        }
    };
    return msgL2;
};

const getMsgL2TemplateStickyNote = () => {
    const msgL2 = {
        head: {
            type: 'stickyNote',
            userid: null,
        },
        payload: {
            id: null,
            loc: {
                x: null,
                y: null,
                w: null,    // width
                h: null,    // heigh
                zindex: null
            },
            text: null,
        },
    };
    return msgL2;
};

const getMsgL2TemplateAddImage = () => {
    const msgL2 = {
        head: {
            type: 'addImage',
            userid: null,
        },
        payload: {
            loc: {
                x: null,    // upper left corner x coordinate
                y: null,    // upper left corner y coordinate
                w: null,    // width of the image, essential for recovering image from bytes
                h: null,    // height of the image, essential for recovering the image from bytes
            },
            gray: null,     // True or False, indicates whether the image is gray, essential for recovering the image from bytes
            bytes: null,    // content of the image
        },
    };
    return msgL2;
};

const getMsgL2Template = (type=TYPES_L2.DRAW) => {
    if (type === TYPES_L2.DRAW) {
        return getMsgL2TemplateDraw();
    } else if (type === TYPES_L2.UNDO) {
        return getMsgL2TemplateUndo();
    }else if (type === TYPES_L2.STICKYNOTE) {
        return getMsgL2TemplateStickyNote();
    } else if (type === TYPES_L2.ADDIMAGE) {
        return getMsgL2TemplateAddImage();
    }
};

module.exports = {
    TYPES_L2,
    getMsgL2Template
};