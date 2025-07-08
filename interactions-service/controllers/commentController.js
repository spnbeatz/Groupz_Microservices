const commentService = require("../services/commentService");

const createComment = async (comment) => {
    console.log(comment, "create comment")
    try {
        
        const newComment = await commentService.createComment(comment);
        return newComment;
    } catch (error) {
        console.log(error);
        return null;
    }
    
}

const deleteComment = async (req, res) => {
    try {
        const { commentId, user } = req.body;
        const result = await commentService.deleteComment(commentId, user.id);
        res.status(200).json(result);
    } catch (error) {
        console.log("Server error while deleting comment!: ", error);
    }
}

const findComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { limit, skip } = req.query;

        const result = await commentService.findComments(postId, limit, skip);

        res.status(200).json(result);

    } catch(error) {
        res.status(500).json(result);
    }
}

const findChildComments = async (req, res) => {
    try {
        const parentId = req.params.parentId;
        const limit = Number(req.query.limit) || 0;

        const data = await commentService.findChildComments(parentId, limit);

        res.status(200).json(data);

    } catch (error) {
        console.log("Server error while fetching child comments: ", error);
        res.status(500).json({message: "Couldn't fetch child comments"});
    }
}



module.exports = {
    createComment,
    deleteComment,
    findComments,
    findChildComments
}