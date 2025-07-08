const mongoose = require("../connect");

const reactionSchema = new mongoose.Schema({
    contentId: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        enum: ["comment", "message", "post"],
        required: true
    },
    reactionType: {
        type: String,
        enum: ["like", "smile", "love", "angry"]
    },
    userId: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

reactionSchema.index({ contentId: 1 });
reactionSchema.index({ reactionType: 1 });

const Reaction = mongoose.model("reactions", reactionSchema);

module.exports = { Reaction }

