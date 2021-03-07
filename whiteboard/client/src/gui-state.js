

// ***************** META DATA BEGIN *************
const DrawLineContext = {
    canvas: null,
    color: null,
    x: null,
    y: null,
    drawing: false,
    id: null,
};

const getCanvasSizeG = () => {
    const canvas = DrawLineContext.canvas;
    return { width: canvas.width, height: canvas.height };
};

// ***************** META DATA ENDS *************


module.exports = {
    DrawLineContext, getCanvasSizeG,
};