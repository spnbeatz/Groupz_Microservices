const userService = require('../services/userService');

// Funkcja do walidacji chatId
const validateChatId = (chatId) => {
    if (!chatId) {
        throw new Error("Chat ID is required");
    }
};

// Funkcja do pobierania uczestników
const getParticipantsData = async (participants) => {
    return await Promise.all(
        participants.map(async (userId) => {
            console.log("Fetching data for user: ", userId);
            const userData = await userService.getMinimumUserData(userId);
            console.log(userData, "userData")
            if (!userData) {
                console.log(`No user data found for user ${user}`);
            }
            return userData;
        })
    );
};

module.exports = { validateChatId, getParticipantsData };
