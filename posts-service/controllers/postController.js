const postService = require("../services/postService");

const newPost = async (req, res) => {
    try {
        const files = req.files;
        const text = req.body.text;
        const user = req.body.user;
        console.log(files, "files from uploading");
        console.log(text, "text postData");
        if(files) {
            const filesUrls = await Promise.all(files.map(async (file) => {

                const uploadedFile = await postService.uploadFile(file);

                console.log(uploadedFile, "uploaded file")

                const attachmentProps = {
                    id: uploadedFile.$id,
                    type: uploadedFile.mimeType
                }
                return attachmentProps;
            }))

            console.log(filesUrls, " file urls uploaded")

            const newPost = {
                user: user,
                content: {
                    text: text,
                    attachments: filesUrls
                }
            }

            console.log(newPost, "formatted new post");

            await savePostToDatabase(newPost, res);
        } else {
            const newPost = {
                user: user,
                content: {
                    text: text,
                    attachments: []
                }
            }

            await savePostToDatabase(newPost, res);
        }
    } catch(error) {
        console.log(error);
    }
}

const savePostToDatabase = async (post, res) => {
    const createResult = await postService.savePostToDatabase(post);

    console.log(post, "save to database - post");
    console.log(createResult.post, "saved post to db");

    if(createResult.status === "success"){
        res.status(200).json({status: createResult.status, post: createResult.post})
    } else {
        res.status(400).json({status: createResult.status, post: null})
    }
}

const getPosts = async (req, res) => {
    try {
        // Konwersja 'limit' na liczbę
        const limit = parseInt(req.query.limit, 10) || 10; // Jeśli limit nie jest liczbą, to domyślnie 10
/*         const user = req.query.user || null; // Jeśli user nie jest podany, to null */
        const skip = parseInt(req.query.skip, 0) || 0;

        const userId = req.query.userId || null;
        // Pobieranie postów z serwisu
        const posts = await postService.getPosts(limit, skip, userId);

        // Zwrócenie postów w odpowiedzi
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error:", error); // Logowanie błędu
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};


module.exports = {
    newPost,
    getPosts
}