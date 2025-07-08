const mongoose = require("../connect");

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    sex: { type: String, required: true, enum: ["Man", "Woman", "Other"]},
    password: { type: String },
    avatar: { type: String, default: "https://www.w3schools.com/howto/img_avatar.png"},
    status: { type: String, default: "offline"},
    notifications: [String],
    sockets: {
        notifications: String
    }
}, { timestamps: true })

const User = mongoose.model("users", userSchema);

module.exports = { User }

