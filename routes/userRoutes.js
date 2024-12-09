const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);
router.get("/getUserProfile", verifyToken, userController.getUserProfile);
router.post("/logout",  userController.logout);

module.exports = router;



