var express = require('express');
var router = express.Router();
var upload = require("../middlewares/storage");
var postController = require("../controllers/postController");
/* GET home page. */
router.post('/', upload.array("files"), postController.newPost);

router.get('/', postController.getPosts);

module.exports = router;
