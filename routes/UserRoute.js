const express = require("express");

const { createUser , loginUser, updateUser, deleteUser, forgetPassword, resetPassword, changePassword, getUserDetails, getUserBySearch, getUserById, followFollowings } = require("../controllers/userController");
const checkToken = require("../middleware/checkToken");
const { route } = require("./PostRoute");

const router = express.Router();


// :denotes params of request sp after/ in request everything will be in _id of params object

router.post("/create", createUser);
router.post("/login", loginUser);
router.put("/update/:_id", checkToken, updateUser);
router.get("/getUserDetails", checkToken, getUserDetails);
router.get("/getUserBySearch", getUserBySearch);
router.get("/getUserById/:_id", getUserById);
router.delete("/delete/:_id", checkToken,  deleteUser);
router.post("/forgetPassword", forgetPassword);
router.get("/resetPassword/:token", resetPassword);
router.post("/changePassword/:token", changePassword);
router.post("/followFollowings/:_id", checkToken, followFollowings);


module.exports = router;






//  router will handle all routing of  user se related function CRUD and other function in server.js ---------------------