const Drawing = (socket) => {
    var canvas = document.getElementsByClassName('whiteboard')[0];
    //var canvas = document.getElementById('canvas');
    var colors = document.getElementsByClassName('color');
    var context = canvas.getContext('2d');
    var undoIcon = document.getElementById('undo');
    var eraseIcon = document.getElementById('erase');

    undoIcon.addEventListener('click', function() {
        onUndo();
    })

    eraseIcon.addEventListener('click', function () {
        current.color = 'white';
    })

    var current = {
        color: 'black'
    };
    var drawing = false;

    const actionHistory = [];
    let actionPointer = -1;

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
        socket.emit("hideLine", { id: action.id, hidden: true });
    }

    function redraw(data) {
        const { lineHist } = data;
        context.clearRect(
            0,
            0,
            context.canvas.clientWidth,
            context.canvas.clientHeight
        );
        for (const line of lineHist) {
            //console.log(line.hidden)
            onDrawingEvent(line);
        }
    };

    socket.on("redraw", redraw);

    window.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && !drawing) {
            if (event.key === "z") {
                onUndo();
            };
        };
    });

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

    socket.on('drawing', onDrawingEvent);

    window.addEventListener('resize', onResize, false);
    onResize();


    function drawLine(x0, y0, x1, y1, color, id, hidden, emit) {
        if (hidden) return;
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        if(color === 'white'){
            context.lineWidth = 50;
        } else{
            context.lineWidth = 3;
        }
        context.stroke();
        context.closePath();

        if (!emit) { return; }
        var w = canvas.width;
        var h = canvas.height;

        socket.emit('drawing', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color,
            hidden: hidden,
            id: id
        });
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

    function onDrawingEvent(data) {
        var w = canvas.width;
        var h = canvas.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.id, data.hidden);
    }

    // make the canvas fill its parent
    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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

};

export default Drawing;
