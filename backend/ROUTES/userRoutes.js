const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // JWT middleware
const { register, login, refreshToken, setAvatar, allUsers, logout, verify, updateProfile } = require("../CONTROLLERS/userController");

// Public routes
router.post("/signup", register);
router.post("/login", login);
router.get("/refreshToken", refreshToken);
router.get("/logout", logout);

// Protected routes
router.post("/setAvatar", auth, setAvatar);   // user ID comes from req.user
router.get("/allUsers", auth, allUsers);     // excludes current user via req.user
router.get("/verify", auth, verify);
router.post("/updateProfile", auth, updateProfile);

module.exports = router;
