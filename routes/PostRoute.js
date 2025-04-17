const express = require("express");
const { createPost, updatePost, deletePost, getAllPost, getYourAllPosts, getFriendAllPosts, commentPost, deleteComment, likePost, getPostById } = require("../controllers/postController");
const checkToken = require("../middleware/checkToken");


const router = express.Router();


router.post("/create", checkToken, createPost);
router.put("/update/:_id", updatePost);
router.delete("/delete/:_id", deletePost);
router.get("/getAllPost", getAllPost);
router.get("/getYourAllPosts", checkToken, getYourAllPosts);
router.get("/getFriendAllPosts/:_id", getFriendAllPosts);
router.post("/commentPost/:postId", checkToken, commentPost);
router.delete("/deleteComment/:commentId/:postId", deleteComment);
router.put("/likesPost/:postId", checkToken, likePost);
router.get("/getPostById/:postId", getPostById);


module.exports = router;