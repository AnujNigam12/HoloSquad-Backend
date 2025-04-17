//  models --> database all collection like Users , posts, Bookings, etc..

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String, 
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },

    email: {
        type: String,
        required: true,
        unique: true, 
    },

    password: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        default: "India"
    },

    profilePic: {
        type: String,
        default: "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png?v=2024122217"
    },

}, {timestamps:true});

// useSchema.add will attach reset Password Token for every user with also new user if we manually add in schema then it will add only in new user.

userSchema.add({
    resetPasswordToken: {
        type: String,
        default: null,
    },

    coverPic : {
        type: String,
        default: "https://www.hdwallpapers.in/thumbs/2020/abstract_cover_background_4k_hd-t2.jpg"
    },

    bio : {
        type: String,
        default: "Edit your Bio, This is App generated"
    },

    contact : {
        type : String,
        default: "0000000000"
    },

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

module.exports = mongoose.model( "User", userSchema);


//  is models/ collection se related saare kaam ya CRUD operation will preform in user controller---------- 


