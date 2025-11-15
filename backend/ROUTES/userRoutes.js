const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // your JWT middleware
const { register, login, refreshToken, setAvatar, allUsers,logout,verify } = require("../CONTROLLERS/userController");

// Public routes
router.post("/signup", register);
router.post("/login", login);
router.get("/refreshToken", refreshToken);

// Protected routes
router.post("/setAvatar", auth, setAvatar);   // user ID comes from req.user
router.get("/allUsers", auth, allUsers);     // excludes current user via req.user
router.get("/logout", auth, logout);
// Verify JWT (frontend can call to check session)


router.get("/verify", auth, verify)

module.exports = router;
