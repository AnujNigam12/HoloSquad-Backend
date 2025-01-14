const mongoose = require("mongoose");
require('dotenv').config();


// .then.catch always return promise that can resolve or reject like try catch So got try catch make it asynn await

// const connectedToDB = () => {
//     mongoose.connect("mongodb://localhost:27017/socialMedia").then(() => console.log("Connected to Database!")).catch(() => console.log("Error to connec to Database"))
// }

const connectedToDB = async () => {
    try {
     let data =  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        console.log("Connected to Database!")
    } catch (error) {
        console.log("Error to connect to Database", error)
    }
}


module.exports = connectedToDB;
