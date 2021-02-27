/* The implementation of the server is quite simple.
 * The only jobs it does are:
 * 1. access approval, check whether the pwd is correct, if it is, construct the web socket.
 * 2. assign a use-id for each client.
 * 3. maintain the web sockets and the mapping from user-id to web socket.
 * 4. disconnect the web socket when a client intents to leave.
 * 5. broadcast all edition data to every other client.
 */

const socketio = require('socket.io');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');


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

const { init, recvMsg, setPwd } = require("./protocol/layer1/sessionLayerServer.js");
const arguments = process.argv;
setPwd(arguments[2]);
io.on('connection', (socket) => {
    // snLayer.validate(socket);
    // snLayer.recvMsg(socket);
    init(socket);
    recvMsg(socket);
});

app.use(cors());
app.use(router);

morgan.token('body', function (req) {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(bodyParser.json());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
