const {Post} = require("../database/models/postModel");
const FormData = require("form-data");
const axios = require("axios");

const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
        });

        const response = await axios.post(process.env.FILE_SERVICE_URL, formData, {
            headers: formData.getHeaders()
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
}

const savePostToDatabase = async (post) => {
    try {
        const newPost = new Post(post);
        await newPost.save();
        return { status: 'success', post: newPost };
    } catch(error) {
        console.log(error);
        return { status: 'failed' }
        
    }
}

const getPosts = async (limit, skip, userId) => {
    try {
/*         let posts;
        
        // Jeśli user jest podany, filtrujemy na podstawie pola user
        console.log("Limit ", limit)
        if (user) {
            posts = await Post.find({ user: user }).limit(Number(limit));
            console.log("fetched posts: ", posts);
            return posts;
        } else {
            // Jeśli user nie jest podany, zwracamy wszystkie posty
            posts = await Post.find({}).limit(Number(limit));
            console.log("fetched posts: ", posts);
            return posts;
        } */
        console.log(userId, "userId looking for posts")
        const query = {};

        if(userId) {
            query.user = userId
        }

        const posts = await Post
            .find(query)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit);
        console.log("fetched posts: ", posts);
        return posts;
    } catch (error) {
        console.log(error);
        return [];
    }
}

module.exports = {
    uploadFile,
    savePostToDatabase,
    getPosts
}