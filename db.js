const mongoose = require("mongoose");

const connectedToDB = async () => {
    try {
        // let data =  await mongoose.connect(process.env.MONGO_URI)
        let data =  await mongoose.connect("mongodb://localhost:27017/socialMedia")
        console.log("Connected to Database!")
    } catch (error) {
        console.log("Error to connect to Database", error)
    }
}


module.exports = connectedToDB;
