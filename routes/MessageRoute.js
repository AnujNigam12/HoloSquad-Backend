const express = require("express");
const checkToken = require("../middleware/checkToken");
const { sendMessage, getChats } = require("../controllers/messageController");

const router = express.Router();





router.post("/sendMessage/:friendId", checkToken, sendMessage);
router.get("/getChats/:friendId", checkToken, getChats);

module.exports = router;