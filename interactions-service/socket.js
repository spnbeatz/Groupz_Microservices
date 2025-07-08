const commentController = require("./controllers/commentController");

const initializeSocketIo = (io) => {
    io.on("connection", (socket) => {
        console.log("Użytkownik połączony: ", socket.id);

        socket.on("joinPost", (postId) => {
            socket.join(postId);
            console.log(`Użytkownik ${socket.id} dołączył do postu ${postId}`);
        })

        socket.on("leavePost", (postId) => {
            socket.leave(postId);
            console.log(`Użytkownik ${socket.id} opuścił post ${postId}`);
        });

        socket.on("sendComment", async (comment) => {
            console.log("SocketIO Received comment: ", comment);

            const newComment = await commentController.createComment(comment);

            if(newComment) {
                console.log("SocketIO saved comment to database: ", newComment);

                io.to(comment.postId).emit("receiveComment", newComment);
            }

        })

        socket.on("disconnect", () => {
            console.log("Użytkownik rozłączony: ", socket.id);
          });
    })
}

module.exports = {initializeSocketIo}