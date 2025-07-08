
const mongoose = require('../connect');

const chatSettingsSchema = new mongoose.Schema({
    background: {
        type: {
            type: String,
            enum: ["color", "image"],
            default: "color"
        },
        value: {
            type: String,
            default: "white"
        }
    }
})

const chatSchema = new mongoose.Schema({
    participants: [String],
    settings: {type: chatSettingsSchema, default: {background: { type: 'color', value: "white"}}},
    
},
{ timestamps: true }
)

const Chat = mongoose.model('chats', chatSchema);

module.exports = { Chat };