

// ***************** META DATA BEGIN *************
const DrawLineContext = {
    canvas: null,
    color: 'black',
    x: null,
    y: null,
    drawing: false,
    id: null,
};

const StickyNoteContext = {
    canvas: null,
    color: null,
    x: null,
    y: null,
    w: null,
    h: null,
    text: null,
    id: null,
};

const getCanvasSizeG = () => {
    const canvas = DrawLineContext.canvas;
    return { width: canvas.width, height: canvas.height };
};

// ***************** META DATA ENDS *************


module.exports = {
    DrawLineContext, StickyNoteContext, getCanvasSizeG,
};