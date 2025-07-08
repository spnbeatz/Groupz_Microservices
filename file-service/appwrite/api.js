const storage = require("./storage");
const path = require("path");
require('dotenv').config();
const { File } = require("node:buffer")

// Funkcja do przesyłania pliku
const uploadFile = async (file) => {
    try {
        console.log(typeof file, "uploading file type");
        const fileObj = new File([file.buffer], file.originalname, {
            type: file.mimetype
        });

        const response = await storage.createFile(
            process.env.APPWRITE_BUCKET_ID,
            "unique()",                    
            fileObj                          
        );
        console.log('File uploaded:', response);
        return response;
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

module.exports = {
    uploadFile
};
