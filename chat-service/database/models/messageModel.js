const mongoose = require('../connect');

const attachmentSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ["image", "video", "file"], // Możesz dodać więcej typów
    },
    url: String,
  });
  
const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, ref: "Chat" },
    senderId: { type: String, required: true },
    text: { type: String, required: false },
    attachments: [attachmentSchema],
    read: { type: Boolean, default: false},
    reactions: {
      likeCount: { type: Number, default: 0 },
      smileCount: { type: Number, default: 0},
      loveCount: { type: Number, default: 0},
      angryCount: { type: Number, default: 0}
    }
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: 1 })

const Message = mongoose.model("messages", messageSchema);

module.exports = {Message};