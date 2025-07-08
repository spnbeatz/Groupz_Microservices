const socketIo = require("socket.io");
const userService = require("../services/userService");

let io;

function initializeSocket(server) {
    io = socketIo(server);

    io.on("connection", (socket) => {
        console.log("Nowe połączenie WebSocket:", socket.id);

        socket.on("subscribe", async (userId, token) => {
            console.log(`Użytkownik ${userId} subskrybuje powiadomienia.`);
            await userService.socketConnection(socket.id, true, userId)
        });

        socket.on("disconnect", () => {
            console.log("Użytkownik rozłączył się:", socket.id);
            userService.socketConnection(socket.id, false);
        });
    });
}

function getIo() {
    if (!io) {
        throw new Error("Socket.io nie został jeszcze zainicjalizowany!");
    }
    return io;
}

module.exports = { initializeSocket, getIo };
