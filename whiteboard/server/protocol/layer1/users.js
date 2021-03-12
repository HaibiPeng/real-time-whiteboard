const users = [];

const getUser = (id) => {
    return users.filter((user) => user.id === id);
};

const addUser = ({ id, room }) => {
    const user = { id, room };

    users.push(user);

    console.log(users);

    return { user, users };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return { user: users.splice(index, 1)[0], users: users };
    }else{
        return { user: false, users: users };
    }
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { getUser, addUser, removeUser, getUsersInRoom };