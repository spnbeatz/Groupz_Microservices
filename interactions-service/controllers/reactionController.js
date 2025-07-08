const reactionService = require("../services/reactionService");

const addReaction = async (req, res) => {
    try {
        console.log("add reaction req body: ", req.body);
        const { userId, contentId, contentType, reactionType } = req.body;
        const reaction = { userId, contentId, contentType, reactionType }
        const response = await reactionService.addReaction(reaction);
        res.status(200).json(response);

    } catch (error) {
        console.log("Server error while adding reaction: ", error);
        res.status(500).json({status: "error", message: `Failed to add reaction! ${error.text()}`})
    }
}

const countReactions = async (req, res) => {
    try {
        const contentId = req.params.contentId;
        
        const response = await reactionService.countReactions(contentId);
        res.status(200).json(response);
    } catch (error) {
        console.log("Server error while counting reactions");
        res.status(500).json({ status: "error", message: "Server error while counting reactions!"});
    }
    

}

const findReaction = async (req, res) => {
    try {
        const userId = req.params.userId;
        const contentId = req.params.contentId;
        const reaction = await reactionService.findReaction(userId, contentId);
        res.status(200).json(reaction)
    } catch (error) {
        res.status(500).json(null)
    }
}

const getReactionsSummary = async (req, res) => {
    try {
        const contentId = req.params.contentId;
        const summary = await reactionService.getReactionsSummary(contentId);
        res.json(summary);
    } catch(error) {
        res.status(500);
        console.log(error)
    }

}

module.exports = {
    addReaction,
    countReactions,
    findReaction, getReactionsSummary
}