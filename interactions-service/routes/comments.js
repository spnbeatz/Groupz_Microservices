var express = require('express');
var router = express.Router();
const commentController = require("../controllers/commentController");
const multer = require('multer');
const upload = multer();

router.post("/create", upload.none(), commentController.createComment);
router.post("/delete", commentController.deleteComment);

router.get("/:postId", commentController.findComments);
router.get("/child/:parentId", commentController.findChildComments)

module.exports = router;
