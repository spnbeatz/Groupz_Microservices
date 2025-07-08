const messageService = require("../services/messageService");
const { validateChatId } = require("../utils/chatUtils");
const userService = require("../services/userService");

const saveMessageToDatabase = async (message) => {
    try{
        if(!message){
            console.log("Sorry, no received message!");
            return null;
        }

        const newMessage = await messageService.saveMessageToDatabase(message);

        return newMessage;
    } catch(error){

    }
}

const getListOfMessages = async (req, res) => {

    try{
        const chatId = req.params.chatId;
        const limit = parseInt(req.query.limit) || 10;
    
        validateChatId(chatId); 
    
        const messages = await messageService.getListOfMessages(chatId, limit);

        const formatedMessages = await Promise.all(messages.map(async (message) => {
            const minUser = await userService.getMinimumUserData(message.senderId);
            return {
                id: message._id,
                date: message.createdAt.toISOString(),
                user: {
                    username: minUser.username,
                    avatar: minUser.avatar,
                },
                messages: [message.text]
            };
        }));


        res.status(200).json(formatedMessages);
    } catch (error) {
        console.error(error);
        res.status(400);
    }

}

module.exports = {
    saveMessageToDatabase,
    getListOfMessages
}