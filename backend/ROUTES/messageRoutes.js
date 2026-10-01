const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { addMessage, getAllMessages } = require("../CONTROLLERS/msgController");

router.post("/addMsg", auth, addMessage);
router.post("/getMsg", auth, getAllMessages);

module.exports = router;