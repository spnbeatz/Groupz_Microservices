const messageController = require("./controllers/messageController");
const userService = require("./services/userService");

const initializeSocketIo = (io) => {
    io.on("connection", (socket) => {
        console.log("Użytkownik połączony: ", socket.id);
      
        socket.on("joinChat", (chatId) => {
          socket.join(chatId);
          console.log(`Użytkownik ${socket.id} dołączył do czatu ${chatId}`);
        });
      
        socket.on("leaveChat", (chatId) => {
          socket.leave(chatId);
          console.log(`Użytkownik ${socket.id} opuścił czat ${chatId}`);
        });
      
        socket.on("sendMessage", async (message) => {
          
          console.log("SocketIO Received message: ", message);
        
          const newMessage = await messageController.saveMessageToDatabase(message.message);

          console.log("SocketIO saved message to database: ", newMessage);

          const minUser = await userService.getMinimumUserData(newMessage.senderId);

          const messageData = {
            id: newMessage._id.toString(),
            date: newMessage.createdAt.toISOString(),
            user: {
                username: minUser.username,
                avatar: minUser.avatar
            },
            messages: [newMessage.text]
          }

          console.log("SocketIO formatted message to send: ", messageData);

          console.log(`Wiadomość do ${message.message.chatId} od ${message.message.senderId}: ${message.message.text}`);
          io.to(message.message.chatId).emit("receiveMessage", messageData);
        });
      
        socket.on("disconnect", () => {
          console.log("Użytkownik rozłączony: ", socket.id);
        });
      });
}

module.exports = { initializeSocketIo }