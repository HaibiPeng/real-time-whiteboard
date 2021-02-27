# Session Layer (Layer 1)

Three types of messages:
1. connect
2. disconnect
3. edit

## Construct a whiteboard session:
1. Client sends a message of type 'connect', with password in the message head.
2. Server checks whether the current number of client has reach the maximum, if it does, refuse the connection and close the web socket.
2. Server checks whether the password is correct. If it does, set the authenticated flag to true, and the session is constructed.
3. The server responds a message of type 'connect', with the assigned 'userId' in the message head.

## Leave a whiteboard session:
1. User sends a message of type 'disconnect' or the web socket is closed because of any reason.
2. The current number of clients is decreased by one. And server can accept future's connections.

## Send a edition.
1. User send a message of type 'edit'.
2. Server broadcast the message to all other clients.