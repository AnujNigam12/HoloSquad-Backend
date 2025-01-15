const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = 4000;

const cors = require("cors");

const database = require("./db");  // connectToDB wala function
database();  // database me invoke karke call kar liya



let userRouter = require("./routes/UserRoute");
let postRouter = require("./routes/PostRoute");
let messageRouter = require("./routes/MessageRoute");


app.use(cors(
    {
        origin: [
            "https://social-media-frontend-ten-liard.vercel.app",
            "http://localhost:5173",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
));


app.use(express.json({limit: "200mb"}));




app.set("view engine", "ejs");
app.set("views");


// socket.io ka connection-----------

let obj = new Map();

const activeUser = (userId, socketId) => {  
    obj.set(userId, socketId);
    console.log(obj); 
}



io.on('connection', (socket) => {
    socket.on('addUser', (userId) => {
       console.log(`userId = ${userId} socketId =  ${socket.id}`);
       activeUser(userId, socket.id);
    });
    socket.on("sendMessage", ({friendId, userId, text}) => {
        console.log({friendId, userId, text});
       let findFriend = obj.has(friendId);
       if (findFriend) {
        let friendSocketId = obj.get(friendId);
        console.log(friendSocketId);
        socket.to(friendSocketId).emit("getMessage", {friendId, userId, text});
       }
       
    });

});


//  api social media app ki -------------------

app.get("/", async(req, res) => {
    res.send("Welcome Page");
});


// register a user ------------

// app.post("/register",  async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         let data = await UserCollection.create({
//             name: name,
//             email,
//             password
//          });
    
//          res.json({msg: "User registered Successfully", success: true})
//     } catch (error) {
//         res.json({msg: "Error in registering user", success: false,error: error.message})
//     }
// });



app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/messages", messageRouter);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



