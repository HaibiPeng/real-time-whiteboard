/* The implementation of the server is quite simple.
 * The only jobs it does are:
 * 1. access approval, check whether the pwd is correct, if it is, construct the web socket.
 * 2. assign a use-id for each client.
 * 3. maintain the web sockets and the mapping from user-id to web socket.
 * 4. disconnect the web socket when a client intents to leave.
 * 5. broadcast all edition data to every other client.
 */
