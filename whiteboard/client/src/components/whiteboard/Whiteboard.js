import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { FaUndoAlt, FaEraser, FaStickyNote, FaImage, FaSave } from 'react-icons/fa';
import queryString from 'query-string';
import StickyNote from '../Stickynote/Stickynote';
import './whiteboard.css';

const { v4: uuidv4 } = require('uuid');
const { connectDL2, disconnectDL2 } = require('protocol');
//const { getUserid } = require("protocol/layer2/stateManageLayer.js");
const { initCanvasG } = require("../../gui-config.js")
const { getStickyNotes } = require("../../../protocol/layer2/stateManageLayer");
const { deleteStickyNoteDG, updateStickyNoteDG } = require("../../gui-stickynote");

let Socket;
//let userid;

const Whiteboard = ({ location }) => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState([]);
    const [stickyNotes, setstickyNotes] = useState([]);
    const [query, setQuery] = useState('');
    const history = useHistory();

    useEffect(() => {
        const { password } = queryString.parse(location.search);

        Socket = connectDL2(password, history);

        initCanvasG();

        return () => {
            disconnectDL2();
        };
    }, [history, location.search]);

    useEffect(() => {
        Socket.on('connection', (message) => {
            setMessage(message);
        });

        Socket.on("roomData", ({ users }) => {
            setUsers(users);
        });

        Socket.on('stickynote', () => {
            setQuery(uuidv4());
        });
    }, [message, users]);

    const getstickyNotes = (event) => {
        event.preventDefault();
        setstickyNotes(getStickyNotes());
        setQuery(uuidv4());
    };


    window.onbeforeunload = () => {
        disconnectDL2();
    };

    window.onhashchange = () => {
        disconnectDL2();
    };

    useEffect(() => {
        setstickyNotes(getStickyNotes());
        //console.log(stickyNotes);
    }, [query])
    
    return (
        <div>
            {/* <div>
                Message:{message.text}
            </div>
            <div>
                Current users:
                {users.map(user =>
                <span key={user.id}> {user.id}</span>
            )}
            </div> */}

            
            <canvas id="canvas" className="whiteboard" width="1200" height="1200"></canvas>   
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
                <div id="stickynote">
                    <FaStickyNote size={30} onClick={(event) => getstickyNotes(event)}/>
                </div>
                <div id='image'>
                    <label className="image-upload">
                        <FaImage size={32} />
                        <input type="file" accept="image/*" />
                    </label>
                </div>
                <div id='save'>
                    <FaSave size={32} />
                </div>
            </div>
            {stickyNotes.map(note => {
                return <StickyNote key={uuidv4()} note={note} id={note.id} onDrag={updateStickyNoteDG} deleteStickyNote={deleteStickyNoteDG}
                    updateStickyNote={updateStickyNoteDG} setQuery={setQuery} />
            }
            )}
            {/* <canvas id="imgCanvas" width="1000" height="700"></canvas> */}
            <script src="/socket.io/socket.io.js"></script>
        </div>
    )
}

export default Whiteboard;