let NotificationCollection = require("../models/NotificationCollection");

const sendNotification = async (req, res) => {    
      const { recipient, sender, type, message, media } = req.body;

      if (!recipient) {
        return res.json({msg: "Please provide recipient for sending Notification", success: false})
      }
      if (!sender) {
        return res.json({msg: "Please provide sender for sending Notification", success: false})
      }
      if (!type) {
        return res.json({msg: "Please provide type for sending Notification", success: false})
      }
      if (!message) {
        return res.json({msg: "Please provide message for sending Notification", success: false})
      }

      try {
        let data = await NotificationCollection.create({
            recipient, 
            sender, 
            type, 
            message,
            media
          });

          res.json({msg: "Notification sended successfully", success: true})
      } catch (error) {
          res.json({msg: "Error creating notification", success: false, error: error.message})
      }
};

const recieveNotification = async (req, res) => {
  try {
      const notifications = await NotificationCollection.find({ recipient : req.params.userId })
          .sort({ createdAt: -1 })
          .limit(50); // Limit results for performance
      res.status(200).json(notifications);
  } catch (error) {
      res.status(500).json({ msg: "Error in fetching notification", success: false, error: error.message});
  }
};


// here we exports all the function and call them in notification routes as api part---------------------
module.exports = {
    sendNotification,
    recieveNotification
};