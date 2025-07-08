const mongoose = require("../connect");

const reactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    contentId: { type: String, required: true },
    contentType: { type: String, required: true, enum: ["post", "message", "comment"]},
    reactionType: { type: String, required: true, enum: ["like", "laugh", "angry", "love", "sad"]}
}, { timestamps: true });

reactionSchema.index({ contentId: 1, contentType: 1, reactionType: 1, createdAt: -1 });

const Reaction = mongoose.model('reactions', reactionSchema);

module.exports = { Reaction };