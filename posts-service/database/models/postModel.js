const mongoose = require("../connect");

const postSchema = new mongoose.Schema({
    user: { type: String, required: true },
    content: {
        text: { type: String, default: "" },
        attachments: [{
            type: { type: String },
            id: { type: String }
        }]
    },
    metadata: { 
        views: { type: Number, default: 0 }, // Liczba wyświetleń posta
        likes: { type: Number, default: 0 }, // Liczba polubień
        shares: { type: Number, default: 0 }, // Liczba udostępnień
    },
    subscribers: [{type: String, default: []}]
},
{
    timestamps: true
});

postSchema.index({ createdAt: 1 });

const Post = mongoose.model('posts', postSchema);

mongoose.connection.once('open', () => {
    // Upewnij się, że indeksy są tworzone po uruchomieniu aplikacji
    Post.createIndexes()
        .then(() => {
            console.log('Indexes created!');
        })
        .catch((err) => {
            console.error('Error creating indexes:', err);
        });
});

module.exports = { Post } 