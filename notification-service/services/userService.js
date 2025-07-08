const updateUser = async (token, notifyId, socketId) => {

    const updateDto = {
        Notifications: notifyId,
        NotificationSocketId: socketId
    }

    const response = await fetch("http://localhost:3000/users/api/user/update", {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: updateDto

    })
}

const socketConnection = async (socketId, connect, userId) => {
    const data = {
        SocketId: socketId,
        Connect: connect,
        UserId: userId
    }
    const response = await fetch(`http://localhost:3000/users/api/user/notifications/socket`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });

    const result = await response.json();
    console.log(result.message);

}

module.exports = {
    updateUser,
    socketConnection
}