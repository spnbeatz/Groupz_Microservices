const mongoose = require("../connect");

const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    parentCommentId: { type: String },
    content: { type: String, required: true },
    childComments: [this]
}, { timestamps: true });

commentSchema.index({ postId: 1, createdAt: -1 });

const Comment = mongoose.model('comments', commentSchema);

module.exports = {Comment};