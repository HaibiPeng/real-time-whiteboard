const users = [];

const getUser = (id) => users.find((user) => user.id === id);

const addUser = ({ id, username, room}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.username === username);

    if (existingUser) {
        return { error: 'Username has been taken, please change to another one!' };
    };

    const user = { id, username, room };

    users.push(user);

    console.log(users);

    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0]
    };
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { getUser, addUser, removeUser, getUsersInRoom };