import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { FaUndoAlt, FaEraser } from 'react-icons/fa';
import queryString from 'query-string';
//import Drawing from './drawing/drawing'

import './whiteboard.css';

import { connectDL2, disconnectDL2, drawLineDL2 } from '../../../protocol/layer2/operationTransferLayerDownstream.js';

let Socket;
const Whiteboard = ({ location }) => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState([]);
    const history = useHistory();
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const { password } = queryString.parse(location.search);

        Socket = connectDL2(password, history);

        return () => {
            disconnectDL2();
        };
    }, [ENDPOINT, history, location.search]);

    useEffect(() => {
        Socket.on('connection', (message) => {
            setMessage(message);
        });

        Socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [message, users]);

    window.onbeforeunload = () => {
        disconnectDL2();
    };

    window.onhashchange = () => {
        disconnectDL2();
    };


    return (
        <div>
            <div>
                Message:{message.text}
            </div>
            <div>
                Current users:
                {users.map(user =>
                <span key={user.id}> {user.id}</span>
            )}
            </div>

            <canvas id="canvas" className="whiteboard"></canvas>

            <div className="colors">
                <div className="color black"></div>
                <div className="color red"></div>
                <div className="color green"></div>
                <div className="color blue"></div>
                <div className="color yellow"></div>
                <div id='erase'>
                    <FaEraser size={35} />
                </div>
                <div id="undo"><FaUndoAlt size={30} /></div>
            </div>

            <script src="/socket.io/socket.io.js"></script>
            <script>
                {
                    window.onload = () => {
                        drawLineDL2(Socket);
                        //drawLineUL2(Socket);
                    }
                }
            </script>
        </div>
    )
}

export default Whiteboard;