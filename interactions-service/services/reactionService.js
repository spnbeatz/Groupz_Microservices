const { Reaction } = require("../database/models/reactionModel");

const addReaction = async (reaction) => {
    try {
        const existingReaction = await Reaction.findOne({ 
            userId: reaction.userId, 
            contentId: reaction.contentId 
        });

        if (existingReaction) {
            if (existingReaction.reactionType === reaction.reactionType) {
                const deleteResult = await Reaction.deleteOne({ _id: existingReaction._id });

                if (deleteResult.deletedCount > 0) {
                    console.log("Reaction deleted successfully");
                    return { status: "success", message: "Successfully deleted reaction!", action: "delete"};
                } else {
                    console.log("Error: Reaction was not deleted.");
                    return { status: "failed", message: "Couldn't delete reaction" };
                }
            } else {
                await Reaction.updateOne(
                    { _id: existingReaction._id },
                    { reactionType: reaction.reactionType }
                );
                console.log("Reaction updated successfully");
                return { status: "success", message: "Successfully changed reaction!", action: "update" };
            }
        }

        const newReaction = new Reaction(reaction);
        await newReaction.save();
        console.log("Reaction created successfully");
        return { status: "success", message: "Successfully added reaction!", action: "create" };

    } catch (error) {
        console.error("Something went wrong when adding reaction:", error);
        return { status: "failed", message: "Couldn't add reaction" };
    }
};




const countReactions = async (contentId) => {
    try {
        const totalReactions = await Reaction.countDocuments({ contentId });
        const reactionTypes = await Reaction.distinct("reactionType", { contentId });

        return { status: "success", message: "Success counting reactions", totalReactions, reactionTypes };
    } catch (error) {
        console.error("Error fetching reactions:", error);
        return { status: "failed", message: "Error counting reactions!", totalReactions: 0, reactionTypes: [] };
    }
}

const findReaction = async (userId, contentId) => {
    try {
        const reaction = await Reaction.findOne({userId, contentId});

        if(reaction) {
            return reaction;
        } else {
            return null
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getReactionsSummary = async (contentId) => {
    try {
        const reactions = await Reaction.aggregate([
            { $match: { contentId } }, // Filtrujemy po contentId
            
            { 
                $group: { 
                    _id: "$reactionType", // Grupujemy po reactionType
                    users: { $push: "$userId" }, // Zbieramy userId do tablicy
                    count: { $sum: 1 } // Liczymy liczbę dokumentów dla każdej reakcji
                }
            },

            { 
                $group: { 
                    _id: null, // Grupujemy całość, aby dodać "total"
                    reactions: { 
                        $push: { 
                            type: "$_id", 
                            users: "$users", 
                            count: "$count" 
                        }
                    },
                    totalUsers: { $addToSet: "$users" }, // Zbieramy unikalnych userów
                    totalCount: { $sum: "$count" } // Sumujemy liczbę wszystkich reakcji
                }
            },

            { 
                $project: {
                    _id: 0,
                    reactions: { 
                        $arrayToObject: { 
                            $map: { 
                                input: "$reactions",
                                as: "reaction",
                                in: [ "$$reaction.type", { users: "$$reaction.users", count: "$$reaction.count" } ]
                            }
                        }
                    },
                    total: { users: { $reduce: { input: "$totalUsers", initialValue: [], in: { $concatArrays: ["$$value", "$$this"] } } }, count: "$totalCount" }
                }
            }
        ]);

        return reactions.length ? reactions[0] : { reactions: {}, total: { users: [], count: 0 } };

    } catch (error) {
        console.error("Error fetching reactions summary:", error);
        throw new Error("Failed to fetch reactions summary");
    }
};

module.exports = {
    addReaction,
    countReactions,
    findReaction,
    getReactionsSummary
}