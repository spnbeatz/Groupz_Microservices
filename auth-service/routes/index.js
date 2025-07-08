var express = require('express');
var router = express.Router();
const userController = require("../controllers/userController");
const multer = require('multer');
const upload = multer();

/* GET home page. */
router.post("/register",upload.none(), userController.register);
router.post("/login",upload.none(), userController.login);
router.get('/authorize',upload.none(), userController.authorize);

module.exports = router;
