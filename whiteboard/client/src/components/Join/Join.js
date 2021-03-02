import React, { useState } from 'react';
//import { useHistory } from "react-router-dom";
import './Join.css';
const { connectDL1 } = require('../../../protocol/layer1/sessionLayerClient.js');

export default function Join(socket) {
    //const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //const [room, setRoom] = useState('');
    

    //const WebSocket = getWebSocket();

    const join = (e) => {
        e.preventDefault();
        connectDL1(password)
        window.location.reload();
    }

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join Whithboard<span role="img" aria-label="emoji">✏️</span></h1>
                {/* <div>
                    <input placeholder="Username" className="joinInput" type="text" onChange={(event) => setUsername(event.target.value)} />
                </div> */}
                <div>
                    <input placeholder="Password" className="joinInput" type="password" onChange={(event) => setPassword(event.target.value)} />
                </div>
                {/* <Link onClick={e => (!username || username === '') ? e.preventDefault() : null} to={`/whiteboard?username=${username}&room=${room}`}>
                    <button className={'button mt-20'} type="submit" >Join</button>
                </Link> */}
                <button className={'button mt-20'} type="submit"
                    onClick={(e) => (!password || password === '') ? e.preventDefault() : join(e)}>Join</button>
            </div>
        </div>
    );
}
