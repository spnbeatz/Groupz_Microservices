var express = require('express');
var router = express.Router();
const appwriteApi = require("../appwrite/api");
const multer = require('multer');

const storageLocal = multer.memoryStorage();
const upload = multer({ storage: storageLocal });


/* GET home page. */
router.post('/', upload.single('file'), async function(req, res, next) {
  try {
    const file = req.file;
    console.log(file, "uploading file");
    const uploadResult = await appwriteApi.uploadFile(file);
    res.json(uploadResult);
    console.log(uploadResult);
  } catch (error) {
    console.log(error);
  }
    
;
  
});

module.exports = router;
