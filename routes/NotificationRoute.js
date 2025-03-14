const express = require("express");
const router = express.Router();
const { sendNotification, recieveNotification, seenNotification } = require("../controllers/notificationController");

router.post("/send", sendNotification);

router.get("/getnotify/:userId", recieveNotification);

module.exports = router;