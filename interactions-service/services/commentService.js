const { Comment } = require("../database/models/commentModel");

const createComment = async (comment) => {
    try {
        const newComment = new Comment(comment);
        await newComment.save();


        return newComment;

    } catch (error) {
        console.log("Server error while creating comment!", error);
    }
}

const deleteComment = async (commentId, userId) => {
    try {
        // 1. Pobierz komentarz z bazy
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return { success: false, message: "Komentarz nie istnieje." };
        }

        // 2. Sprawdź, czy użytkownik jest właścicielem komentarza
        if (comment.userId.toString() !== userId) {
            return { success: false, message: "Nie masz uprawnień do usunięcia tego komentarza." };
        }

        // 3. Usuń komentarz
        const deleteResult = await Comment.deleteOne({ _id: commentId });

        if (deleteResult.deletedCount > 0) {
            console.log(`Komentarz o ID ${commentId} został usunięty.`);
            return { success: true, message: "Komentarz usunięty." };
        } else {
            return { success: false, message: "Nie udało się usunąć komentarza." };
        }
    } catch (error) {
        console.error("Błąd serwera podczas usuwania komentarza:", error);
        return { success: false, message: "Wystąpił błąd serwera." };
    }
};

const findComments = async (postId, limit, skip) => {
    try {
        const comments = await Comment.aggregate([
            {
              $match: {
                postId,
                parentCommentId: null
              }
            },
            { $sort: { createdAt: -1 } },
            { $skip: Number(skip) },
            { $limit: Number(limit) },
            {
              $lookup: {
                from: "comments",
                let: { parentId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$parentCommentId", { $toString: "$$parentId" }] }
                    }
                  },
                  { $count: "total" }
                ],
                as: "childCount"
              }
            },
            {
              $addFields: {
                childCount: {
                  $ifNull: [{ $arrayElemAt: ["$childCount.total", 0] }, 0]
                }
              }
            },
            {
              $project: {
                userId: 1,
                content: 1,
                postId: 1,
                createdAt: 1,
                childCount: 1,
                parentCommentId: 1
              }
            }
        ]);

        const count = await Comment.countDocuments({postId, parentCommentId: null })

        return { message: "Successfully fetched parent comments!", comments, count };
    } catch (error) {
        console.log("Error with fetching parent comments: ", error);
        return { message: "Error with fetching parent comments!" };
    }
};

const findChildComments = async (parentId, limit) => {
    try {

        let comments = await Comment.find({parentCommentId: parentId})
            .sort({createdAt: -1})

        const count = await Comment.countDocuments({parentCommentId: parentId});

        return {
            message: `Found ${count} child comments!`,
            count,
            parentId,
            comments: comments || []
        }
    } catch (error) {
        console.log("Couldn't fetch child comments", error);
        return {
            message: "Couldn't fetch child comments",
            count: 0,
            comments: []
        }
    }
}

module.exports = {
    createComment,
    deleteComment,
    findComments,
    findChildComments
}