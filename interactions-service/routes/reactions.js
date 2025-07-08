var express = require('express');
var router = express.Router();
const reactionController = require("../controllers/reactionController");
const multer = require('multer');
const upload = multer();
/* GET users listing. */
router.post("/add",upload.none(), reactionController.addReaction);

router.get("/count/:contentId", reactionController.countReactions);
router.get("/find/:contentId/:userId", reactionController.findReaction);
router.get("/summary/:contentId", reactionController.getReactionsSummary);

module.exports = router;
