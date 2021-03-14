const { DrawLineContext, getCanvasSizeG } = require('./gui-state.js');
const protocol = require("protocol");

const resizeImg = (image) => {
    var MAX_WIDTH = 300;
    var MAX_HEIGHT = 200;
    var width = image.width;
    var height = image.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }
    return { width, height };
}

const addImageDG = (event) => {
    if (event.target.files[0]) {
        let reader = new FileReader();
        //const file = document.querySelector('input[type=file]').files[0];
        let file = event.target.files[0];
        const x = Math.floor(Math.random() * 500)
        const y = Math.floor(Math.random() * 400 + 80)
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            var image = new Image();
            image.src = e.target.result;
            //console.log(e.target.result);
            image.onload = function () {
                var imageCanvas = document.getElementById('imgCanvas');
                var context = imageCanvas.getContext('2d');
                const { width, height } = resizeImg(image);
                const canvasWidth = getCanvasSizeG().width;
                const canvasHeight = getCanvasSizeG().height;
                context.drawImage(image, x, y, width, height);
                //let imgData = imageCanvas.toDataURL("image/jpeg");
                protocol.addImageDL2(x / canvasWidth, y / canvasHeight, width, height, e.target.result);
            } 
        }
    }
}

const addImageUG = (msgL2) => {
    var image = new Image();
    image.src = msgL2.payload.bytes;
    image.onload = function () {
        var imageCanvas = document.getElementById('imgCanvas');
        var context = imageCanvas.getContext('2d');
        const canvasWidth = getCanvasSizeG().width;
        const canvasHeight = getCanvasSizeG().height;
        context.drawImage(image, msgL2.payload.loc.x * canvasWidth, msgL2.payload.loc.y * canvasHeight, msgL2.payload.loc.w, msgL2.payload.loc.h);
    }
}

module.exports = { addImageDG, addImageUG }