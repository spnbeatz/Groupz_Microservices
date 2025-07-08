const { Message } = require('../database/models/messageModel');

const saveMessageToDatabase = async (message) => {
    
    try{
        const newMessage = new Message(message);
        await newMessage.save();
        return newMessage;
    } catch(error){
        console.log("Error with saving message to database: ", error);
    }

}

const getListOfMessages = async (chatId, limit) => {
    try{
        const messages = await Message.find({chatId}).limit(limit);
        return messages;
    } catch(error){
        console.log("Error with fetching messages", error);
        return [];
    }
    
}

module.exports = {
    saveMessageToDatabase,
    getListOfMessages
}