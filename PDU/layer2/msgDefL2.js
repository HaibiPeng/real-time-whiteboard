// Message definition of layer 2, say, the operation management layer
// PDUs are defined by functions

// enumeration of 'type'
const TYPES_L2 = {
    DRAW: 'draw',
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
                x1: null,
                y1: null,
                x2: null,
                y2: null,
            },
            color: null,
        },
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
            loc: {
                x: null,
                y: null,
                w: null,    // width
                h: null,    // height
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

const getMsgL2Template = (type='draw') => {
    if (type === 'draw') {
        return getMsgL2TemplateDraw();
    } else if (type === 'stickyNote') {
        return getMsgL2TemplateStickyNote();
    } else if (type === 'addImage') {
        return getMsgL2TemplateAddImage();
    }
};

module.exports = {
    TYPES_L2,
    getMsgL2Template
};