var express = require('express');
var router = express.Router();
const userController = require("../controllers/userController")
const multer = require('multer');
const upload = multer();

/* GET users listing. */
router.post("/create",upload.none(), userController.createUser)

router.get("/user", userController.getUser)

router.get("/:userId", userController.getUserById);

router.get("/:userId/basic-data", userController.getUserBasicData)

module.exports = router;
