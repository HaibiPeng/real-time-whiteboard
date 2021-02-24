const socketio = require('socket.io');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const { Join, Disconnect } = require('./session/session')
const { Drawing } = require('./data/drawing')

const PORT = process.env.PORT || 5000;

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Server is up and running')
});

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    Join(socket, io);

    Drawing(socket);

    Disconnect(socket, io);
});

app.use(cors());
app.use(router);

morgan.token('body', function (req) {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(bodyParser.json());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));