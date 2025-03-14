const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true },
    sender: { type: String, required: true  },
    type: { type: String, required: true }, // e.g., 'like', 'comment', 'follow'
    message: { type: String }, // Optional, for custom messages
    media : {type: String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
