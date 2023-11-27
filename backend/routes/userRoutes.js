const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.post("/auth/register", authController.register);

router.post("/auth/login", authController.login);

router.get("/", authController.protect, userController.getAllUser);

module.exports = router;
