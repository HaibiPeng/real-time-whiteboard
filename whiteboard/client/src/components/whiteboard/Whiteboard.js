import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { FaUndoAlt, FaEraser, FaStickyNote } from 'react-icons/fa';
import queryString from 'query-string';
import StickyNote from '../Stickynote/Stickynote';


import './whiteboard.css';

const { connectDL2, disconnectDL2 } = require('protocol');
const { getUserid } = require("protocol/layer2/stateManageLayer.js");
const { initCanvasG } = require("../../gui-config.js")
const { getStickyNotes } = require("../../../protocol/layer2/stateManageLayer");
const { deleteStickyNote, updateStickyNote } = require("../../gui-stickynote");

let Socket;
let userid;

const Whiteboard = ({ location }) => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState([]);
    const [stickyNotes, setstickyNotes] = useState([]);
    const [query, setQuery] = useState();
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
    }, [message, users]);

    const getstickyNotes = (event) => {
        event.preventDefault();
        setstickyNotes(getStickyNotes());
        setQuery(Math.random());
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

            <canvas id="canvas" className="whiteboard" width="100" height="100"></canvas>            
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
            </div>
            {stickyNotes.map(note => 
                <StickyNote key={note.id} note={note} id={note.id} onDrag={updateStickyNote} deleteStickyNote={deleteStickyNote} 
                    updateStickyNote={updateStickyNote} setQuery={setQuery}/>
            )}

            <script src="/socket.io/socket.io.js"></script>
            <script>
                {
                    window.onload = () => {
                        setTimeout(() => {
                            getUserid().then(returnedUserid => {
                                userid = returnedUserid;
                                console.log(userid);
                                //drawLineDL2(userid);
                            });
                        }, 1000);
                    }
                }
            </script>
        </div>
    )
}

export default Whiteboard;