// Model me User collection se related saare function for req and response and buisness logic will be here and route all function to user routes-------------------------

const UserCollection = require("../models/UserCollection");

var bcrypt = require("bcryptjs");

var salt = bcrypt.genSaltSync(12);

var jwt = require('jsonwebtoken');

let JWT_secretKey = "akash@0410";

var randomstring = require("randomstring");

const nodemailer = require("nodemailer");


//  create a user in user controller middleware -----------

const createUser = async (req, res) => {
   const {name, email, password} = req.body;

   if (!name) {
   return res.json({msg: "Name is required", success: false})
   }

   if (!email) {
   return res.json({msg: "Email is required", success: false})
   }

   if (!password) {
  return  res.json({msg: "Password is required", success: false})
   }
   
   let checkEmail = await UserCollection.findOne({email});

   if (checkEmail) {
    return res.json({msg: "User already exist", success: false})
   }



   try {

    let hashedPassword = bcrypt.hashSync(password, salt);

    // console.log(password);

    // console.log(hashedPassword);


     let data = await UserCollection.create({
        name: name,
        email: email,
        password: hashedPassword,
     });

// second method to register a user in database---------------

    // let data = await new UserCollection({
    //     name: name,
    //     email: email,
    //     password: hashedPassword,
    // })
    // await data.save();


    // send account registered email to user gmail
       registerconfirm(name, email);


     res.json({msg: "User registered successfully", success: true, user: data})
   } catch (error) {
    res.json({msg: "Error registering a user", success: false, error: error.message})
   }
}




// login  a user using user controller middleware and route in /login through user route in server.js --------

const loginUser = async (req, res) => {
    const {email, password} = req.body;
 
    if (!email) {
       return res.json({msg: "Email is required", success: false})
    }

    if (!password) {
      return  res.json({msg: "Password is required", success: false})
    }



    try {
        var checkUser = await UserCollection.findOne({email: email});
        // console.log(checkUser);
    
        if (checkUser) {
            let comparePassword = bcrypt.compareSync(password, checkUser.password);
    
            if (comparePassword) {
                
                let token = jwt.sign({id: checkUser._id}, JWT_secretKey)
                
                loginConfirmation(checkUser.name, checkUser.email)

                res.json({msg: "User login Successfully", success: true, token: token})
            }
    
            else {
                res.json({msg: "Password incorrect", success: false})
            }
        }
    
        else {
            res.json({msg: "User not found", success: false})
        }
        
    } catch (error) {
        res.json({msg: "Login failed", success: false, error: error.message})
    }

}



//  update  a user in user controller middleware via user route-------- 

const updateUser = async (req, res) => {

    let _id = req.user;

// res.json("update user running")
  

    //  console.log(req.params);
    //  console.log(req.params._id);

    if (_id !== req.params._id) {
       return res.json({msg: "You are not authorized to update this user", success: false})
    }


    let {name, password, city, profilePic, coverPic, bio, contact} = req.body;

    if (password) {
       var  hashedPassword = bcrypt.hashSync(password, salt);
       }


   try {
      let findUser = await UserCollection.findByIdAndUpdate(_id,
         {
            name: name,
            password: hashedPassword,
            city,
            profilePic,
            coverPic,
            bio,
            contact
        })

        res.json({msg: "User updated successfully", success: true})
   } catch (error) {
    res.json({msg: "Failed to update a user", success: false, error: error.message})
   }

   

    // let updatedUser = await UserCollection.findByIdAndUpdate(id, {name: "Akash3"});

    // let updatedUser = await UserCollection.updateOne({_id: id}, {$set: {name: "Akash3"}})


    // res.json("user updated successfully");

}




// delete  a user in user controller middleware via user route---------

const deleteUser = async (req, res) => {

    let id  = req.user;
  

    if (id !== req.params._id) {
        return res.json({msg: "You are not authorized to delete this account", success: false})
    }

    // console.log(id);

    try {
        let deleteUser = await UserCollection.findByIdAndDelete(id);

        res.json({msg: "User deleted successfully", success: true});

    } catch (error) {
        res.json({msg: "Failed to delete a user", success: false, error: error.message})
    }  
}



//  password forget for a user using email and send forget password link in gmail  ------------------------- 

const forgetPassword = async (req, res) => {
   const {email} = req.body;

   if (!email) {
    return res.json({msg: "Please enter your email", success: false})
   }

    try {

        let findUser = await UserCollection.findOne({email});

        if (findUser) {

          let resetToken = randomstring.generate(20);
                // console.log(resetToken)

// reach to key and update that value and save it using save()----

        //    findUser.resetPasswordToken = resetToken;
        //    await findUser.save();

          let updateUser = await UserCollection.findByIdAndUpdate(findUser._id, {resetPasswordToken: resetToken});


           sendEmail(email, resetToken, findUser.name)

           res.json({msg: `Hii ${findUser.name}, Please check your email ${email} for further instructions`, success: true});
       }
    
       else{
        res.json({msg: `This email ${email} does not exist in our Records`, success: false})
       }
    } catch (error) {
        res.json({msg: "Update Password failed for Sometime!", success: false, error: error.message})
    }
   


}


// reset password for a user which get link in gmail for change his password-------------

const resetPassword = async (req, res) => {
    let token = req.params.token;
//   res.send("i am running");

// it renders the reset Password html page onclick to reset password link------------


  try {
    let user =  await UserCollection.findOne({resetPasswordToken: token})

     if (user) {
        res.render("resetPassword", {token});
     }

     else {
        res.render("alreadyResetPassword")
        // res.send("token expire");
     }
  } catch (error) {
    res.json({msg: "Failed to update password", success: false})
  }
     
     
}


// change a user password after submit the change password form ehich ibtain through gmail link-------

const changePassword = async (req, res) => {
    let token = req.params.token;
    let newPassword = req.body.newPassword;
     
    if (!newPassword) {
        return res.json({msg: "Password not found!!", success: false})
    }


    try {
        let user = await UserCollection.findOne({resetPasswordToken: token});

       if (user) {
        let hashedPassword = bcrypt.hashSync(newPassword, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = null
        await user.save();

        changePasswordSuccess(user.email, user.name);

        res.json({msg: "Password successfully updated, Click to Login", success: true})
       } 
       else {
        res.json({msg: "Your token has been expired, Click here to Login", success: false})
       }

    } catch (error) {
        res.json({msg: "Failed to change your password", success: false, error: error.message});
    }
    
}



// get all user details for user profile page me display karne ke liye 
const getUserDetails = async (req, res) => {
   let userId = req.user;


   try {
    let data = await UserCollection.findById(userId).populate({path: "followers", select: "name profilePic coverPic"}).populate({path: "followings", select: "name profilePic coverPic"});
    res.json({msg: "User details here",success: true, data})
   } catch (error) {
    res.json({msg: "Failed to get User Details", success: false, error: error.message})
   }

}


// for get all user by searching -------------
const getUserBySearch = async (req, res) => {
   let name = req.query.q;

   if (name) {
    let findName = new RegExp(name);
   

    let data = await UserCollection.find({name: findName});
 
   return res.json(data);
   }

   else {
   return res.json([]);
   }
 

}


// for getting friend Details by search and get friend Profile details----------
const getUserById = async (req, res) => {
   let id = req.params._id;

   try {
    let data = await UserCollection.findById(id).select("-password -email -resetPasswordToken -contact").populate({path: "followers", select: "name profilePic coverPic"}).populate({path: "followings", select: "name profilePic coverPic"}); 
    res.json({msg: "User details here", success: true, data})
   } catch (error) {
    res.json({msg: "Failed to get User details", success: false, error: error.message})
   }
    

}


// for followers and followings -----------------
const followFollowings = async (req, res) => {
  let userId = req.user;
  let friendId = req.params._id;

    if (userId !== friendId) {
      try {
        let userDetails = await UserCollection.findById(userId);
        let friendDetails = await UserCollection.findById(friendId);
    
        // console.log(userDetails);
        // console.log(friendDetails);
    
        if (userDetails.followings.includes(friendId)) {
          // userDetails.followings.pull(friendId);
          // friendDetails.followers.pull(userId);
    
          // await userDetails.save();
          // await friendDetails.save();
    
          await UserCollection.findByIdAndUpdate(userId, {$pull: {followings: friendId}});
          await UserCollection.findByIdAndUpdate(friendId, {$pull: {followers: userId}});
    
    
         return res.json({msg: "User Unfollowed Successfully", success: true});
        } 
        else {
          // userDetails.followings.push(friendId);
          // friendDetails.followers.push(userId);
    
          // await userDetails.save();
          // await friendDetails.save();
    
          await UserCollection.findByIdAndUpdate(userId, {$push: {followings: friendId}})
          await UserCollection.findByIdAndUpdate(friendId, {$push: {followers: userId}});
    
        return res.json({msg: "User Followed Successfully", success: true});
        }
    
      } catch (error) {
        res.json({msg: "Failed to follow user", success: false, error: error.message})
      }
    }

    else {
      return res.json({msg: "Cannot follow yourself", success: false})
    }

 
 
  
  
}


// email send wala function for forget password ----------
function sendEmail(email, token, name) {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "holosquadteam165909@gmail.com",
          pass: "uull dond psqx uaiy",
       
        },
      });


      // async..await is not allowed in global scope, must use a wrapper
   async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"HoloSquad 👻" <holosquadteam165909@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Reset your Account Paasword ✔", // Subject line
      text: `Hii 😎 ${name} \n 🤖 Please click on the below link to update your Password: \n  💁 "https://socialmediabackend-abt5.onrender.com/users/resetPassword/${token}"`, // plain text body
    });
  
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
  main().catch(console.error);
  
}

// email send wala function for register user ------
function registerconfirm(name, email) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "holosquadteam165909@gmail.com",
          pass: "uull dond psqx uaiy",
       
        },
      });


      // async..await is not allowed in global scope, must use a wrapper
   async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"HoloSquad 👻" <holosquadteam165909@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `${name}, Thank you for registering with us ✔`, // Subject line
      text: `Hii 😎 ${name} \n Yor have successfully created your account 🥳 \n To login your account Click here 💁 "https://social-media-frontend-ten-liard.vercel.app/signin"`, // plain text body
    });
  
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
  main().catch(console.error);
  
}

// email send wala function for login  a user ------

function loginConfirmation(name, email) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "holosquadteam165909@gmail.com",
          pass: "uull dond psqx uaiy",
       
        },
      });


      // async..await is not allowed in global scope, must use a wrapper
   async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"HoloSquad 👻" <holosquadteam165909@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `${name}, Alerts!!!!!!!!!!!`, // Subject line
      text: `Hiiii 😎 ${name}, \n We have found a login in your account 🤔 \n If you don't, 🙀 Urgently change your password!!!!!! \n Click here to change Your Password 💁 "https://social-media-frontend-ten-liard.vercel.app/signin"`, // plain text body
    });
  
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
  main().catch(console.error);
}

// email send when user successfully changed his password ----

function changePasswordSuccess(email, name) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "holosquadteam165909@gmail.com",
          pass: "uull dond psqx uaiy",
       
        },
      });


      // async..await is not allowed in global scope, must use a wrapper
   async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"HoloSquad 👻" <holosquadteam165909@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `${name}, Congratulations Password change successfull!!!!`, // Subject line
      text: `Hiiii 😎 ${name}, \n You have successfully changed your Instamart password linked to  ${email} 🤔 \n Click here to login 💁 "https://social-media-frontend-ten-liard.vercel.app/signin"`, // plain text body
    });
  
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
  main().catch(console.error);
}

const getAllUsers = async (req, res) => {
    try {
        const users = await UserCollection.find(); // Fetch all users from DB
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error });
    }
}


//  All funtion with handle request, response and buisness logic in each function ie here exported for UserRoute ---------------

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUserDetails,
    getUserBySearch,
    getUserById,
    forgetPassword,
    resetPassword,
    changePassword,
    followFollowings,
    getAllUsers
};
