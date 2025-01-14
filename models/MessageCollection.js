//  models --> database all collection like Users , posts, messages, etc..

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    friendId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 

    text: {
        type: String
    }
}, {timestamps: true});


module.exports = mongoose.model("Message", messageSchema);