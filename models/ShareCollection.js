const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true },
    sender: { type: String, required: true  },
    media : {type: String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Share", shareSchema);
