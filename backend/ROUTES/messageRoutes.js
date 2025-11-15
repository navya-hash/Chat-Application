const express = require("express");
const router = express.Router();
const { addMessage, getAllMessages } = require("../CONTROLLERS/msgController");

router.post("/addMsg", addMessage);
router.post("/getMsg", getAllMessages);

module.exports = router;
//never mix import and require