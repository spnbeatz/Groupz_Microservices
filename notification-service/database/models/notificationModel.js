const mongoose = require("../connect");

const notificationSchema = new mongoose.Schema({
    contentId: String,
    content: String,
    sentAt: { type: Date, default: Date.now }
})

const Notification = mongoose.model("notifications", notificationSchema);

module.exports = { Notification }