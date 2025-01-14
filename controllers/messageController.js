// Model me Message collection se related saare function for req and response and buisness logic will be here and route all function to message routes-------------------------

const MessageCollection = require("../models/MessageCollection");
const ConversationCollection = require("../models/ConversationCollection");



// for send a message -------------------
const sendMessage = async (req, res) => {
    const friendId = req.params.friendId;
    const userId = req.user;
    const {text} = req.body;

    if (!text) {
        return res.json({msg: "Please send a message", success: false});
    }


    try {
        let createMessage = await MessageCollection.create({
            userId,
            friendId,
            text
        });

        let findConversation = await ConversationCollection.findOne({
            members: { $all: [userId, friendId] }
          });          

        if (!findConversation) {
             await ConversationCollection.create({
            members: [userId, friendId],
            messages: [createMessage._id]
           });
           res.json({msg: "Message sent Successfully", success: true});
        }

        else {
            findConversation.messages.push(createMessage._id);
            await findConversation.save();
            res.json({msg: "Message sent Successfully", success: true});
        }
       
    } catch (error) {
        res.json({msg: "Message not send", success: false, error: error.message})
    }
   

}


//  for getting all chats between user and its friend --------------
const getChats = async (req, res) => {
    const friendId = req.params.friendId;
    const userId = req.user;

    try {
        let findConversation = await ConversationCollection.findOne({members: {$all: [userId, friendId]}}).populate({
            path: "messages",
            select: "userId text createdAt updatedAt", 
            populate : ({path: "userId", select: "name profilePic"})
        });

        if (!findConversation) {
            findConversation ={
                messages : []
            }
           
        }
        res.json({msg: "Chats here", success: true, findConversation});
    } catch (error) {
        res.json({msg: "Failed to get chats", success: false, error: error.message}); 
    }

    
}


//  All funtion with handle request, response and buisness logic in each function ie here exported for MessageRoute ---------------


module.exports = {
    sendMessage,
    getChats,
}