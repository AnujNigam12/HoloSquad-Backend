//  models --> database all collection like Users , posts, Bookings, etc..

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
  },

  file: {
    type: String,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }



}, {timestamps: true});

postSchema.add({
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String
    }
  ],

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: "User" 
    }
  ]
});




module.exports = mongoose.model("Post", postSchema);