const { Chat } = require('../database/models/chatModel');
const { Message } = require('../database/models/messageModel');

const createChat = async (participants) => {
    try {

        const chat = await Chat.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            { $setEquals: ["$participants", participants] }, // Porównanie zbiorów
                            true
                        ]
                    }
                }
            }
        ]);
        

        if(chat.length > 0) {
            console.log("chat już istnieje: ", chat);
            return chat[0]._id.toString();
        }
            

        const newChat = new Chat({participants: participants});
        await newChat.save();
        console.log("utworzono czat!");
        return newChat._id.toString();
    } catch (error) {
        console.log("Nie udało się stworzyć czatu!");
    }
}

const getChatList = async (userId) => {
    try {
        const chats = await Chat.find({ participants: userId });
        return chats;
    } catch (error) {
        console.error("Błąd podczas wyszukiwania czatów:", error);
        return [];
    }
}

const getChatMessagesList = async (chatId) => {
    try {
        const messages = await Message
            .find({chatId})
            .sort({ createdAt: -1 });

        return messages;
    } catch (error) {
        console.log(error);
        return [];
    }

}

const getChatData = async (chatId) => {
    try {
        const chat = await Chat.find({_id: chatId});
        return chat[0];
    } catch (error) {
        return null;
    }
}

module.exports = {
    createChat,
    getChatList,
    getChatMessagesList,
    getChatData
}