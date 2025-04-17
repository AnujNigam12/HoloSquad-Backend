const express = require("express");
const router = express.Router();
const { sendMedia, recieveMedia } = require("../controllers/shareController");

router.post("/send", sendMedia);

router.get("/getnotify/:userId", recieveMedia);

module.exports = router;