const chatService = require("../services/chatService");
const userService = require("../services/userService");
const { validateChatId, getParticipantsData } = require('../utils/chatUtils');

const createChat = async (req, res) => {
    try {
        console.log(req.body);
        const participants = Object.values(req.body);
        console.log(participants, "participants")
        const createdChatId = await chatService.createChat(participants);
        console.log("Id chatu: ", createdChatId);
        res.status(200).json({chatId: createdChatId});
    } catch (error) {
        console.error("Błąd tworzenia czatu:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Nieprawidłowe dane wejściowe" });
        }

        res.status(500).json({ error: "Wewnętrzny błąd serwera" });
    }
}

const getChatList = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const chatList = await chatService.getChatList(userId);

        const formattedChats = await Promise.all(chatList.map(async (chat) => {
            const participants = await getParticipantsData(chat.participants);

            const messages = await chatService.getChatMessagesList(chat._id.toString());
            const lastMessage = messages.length > 0 ? messages[0] : null;

            return {
                id: chat._id.toString(),
                participants,
                settings: chat.settings,
                lastMessage
            };
        }));

        return res.json(formattedChats);

    } catch (error) {
        console.error("Error fetching chat list:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getChatData = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        console.log("getChatData chatId param: ", chatId);

        try {
            validateChatId(chatId);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        // Pobieranie danych o czacie
        const chat = await chatService.getChatData(chatId);

        console.log("getChatData - fetched chatData: ", chat);

        if (chat) {
            try {
                const participants = await getParticipantsData(chat.participants);

                console.log("getChatData - participants fetched: ", participants);

                const chatData = {
                    id: chat._id.toString(),
                    participants,
                    settings: chat.settings
                };

                console.log("getChatData - formatted ChatData: ", chatData);

                return res.json(chatData);
            } catch (err) {
                console.error("Error while fetching participants or user data: ", err);
                return res.status(500).json({ error: "Error while fetching participants or user data" });
            }
        } else {
            console.log("getChatData - no data found for chat");
            return res.status(404).json({ error: "Chat not found" });
        }
    } catch (error) {
        console.error("Error fetching chat data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};




module.exports = {
    createChat,
    getChatList,
    getChatData
}