const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require('dotenv').config();

const port = 4000;

const cors = require("cors");

const database = require("./db");  // connectToDB wala function
database();  // database me invoke karke call kar liya



let userRouter = require("./routes/UserRoute");
let postRouter = require("./routes/PostRoute");
let messageRouter = require("./routes/MessageRoute");
let notificationRouter = require("./routes/NotificationRoute");


app.use(cors(
    {
        origin: [
            process.env.VITE_LIVE_API_URL,
            process.env.VITE_LIVE_API_URL_LOCAL
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
));

// app.use(cors())

app.use(express.json({ limit: "200mb" }));




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

    socket.on("sendMessage", ({ friendId, userId, text }) => {
        console.log({ friendId, userId, text });
        let findFriend = obj.has(friendId);
        if (findFriend) {
            let friendSocketId = obj.get(friendId);
            console.log(friendSocketId);
            socket.to(friendSocketId).emit("getMessage", { friendId, userId, text });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


//  api social media app ki -------------------

app.get("/", async (req, res) => {
    res.send("Welcome Page");
});

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/messages", messageRouter);
app.use("/notifications", notificationRouter);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



