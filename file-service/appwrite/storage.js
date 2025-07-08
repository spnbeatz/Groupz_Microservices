const sdk = require('node-appwrite');
require('dotenv').config();

const client = new sdk.Client();

const storage = new sdk.Storage(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY)
;


module.exports = storage;