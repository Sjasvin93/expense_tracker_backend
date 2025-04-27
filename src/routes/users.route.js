const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/upload.middleware")

const Controller = require("../controllers/users.controller");

router.post("/register-user", Controller.registerUser);

router.post("/login-user", Controller.loginUser);

router.get("/user-info/:id", Controller.getUserInfo);

router.post('/upload-image', upload.single('image'), Controller.uploadImage);

module.exports = router;
