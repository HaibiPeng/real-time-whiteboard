import React from 'react';
import { FaUndoAlt, FaEraser } from 'react-icons/fa';
//import Drawing from './drawing/drawing'

import './whiteboard.css';

import { disconnectDL1, getWebSocket } from '../../../protocol/layer1/sessionLayerClient.js';

const Whiteboard = () => {
    window.onbeforeunload = () => {
        disconnectDL1();
        getWebSocket.off();
        //return 'refreshing/leaving this page?';
    };

    window.onhashchange = () => {
        disconnectDL1();
        getWebSocket.off();
        //return 'refreshing/leaving this page?';
    };

    return (
        <div>
{/*             <div>
                Message:{message.text}
            </div>
            <div>
                Current users:
                {users.map(user =>
                <span key={user.id}> {user.username}</span>
            )}
            </div> */}

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
            {/* <script>
                {
                    window.onload = () => {
                        Drawing(socket);
                    }
                }
            </script> */}
        </div>
    )
}

export default Whiteboard;