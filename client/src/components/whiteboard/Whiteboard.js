import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import queryString from 'query-string';
import io from 'socket.io-client';
import Drawing from './drawing/drawing'

import './style.css';

let socket;

const Whiteboard = ({ location }) => {
    //const [username, setUsername] = useState('');
    //const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState([]);
    const history = useHistory();
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const { username, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        socket.emit('join', { username: username, room: room }, (error) => {
            if (error) {
                alert(error);
                history.push('/');
            };
        });

        return () => {
            socket.emit('disconnected');
            socket.off();
        };
    }, [ENDPOINT, history, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessage(message);
            console.log(message);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
            console.log(users);
        });
    }, [message, users]);

    window.onbeforeunload = () => {
        socket.emit('disconnected');
        socket.off();
        //return 'refreshing/leaving this page?';
    };

    window.onhashchange = () => {
        socket.emit('disconnected');
        socket.off();
        //return 'refreshing/leaving this page?';
    };

    return (
        <div>
            <div>
                Message:{message.text}
            </div>
            <div>
                Current users:
                {users.map(user => 
                    <span key={user.id}> {user.username}</span>
                )}
            </div>
            
            <canvas id="canvas" className="whiteboard"></canvas>

            <div className="colors">
                <div className="color black"></div>
                <div className="color red"></div>
                <div className="color green"></div>
                <div className="color blue"></div>
                <div className="color yellow"></div>
            </div>

            <script src="/socket.io/socket.io.js"></script>
            <script>
                {
                    window.onload = () => {
                        Drawing(socket);
                    }
                }
            </script>
        </div>
    )
}

export default Whiteboard;