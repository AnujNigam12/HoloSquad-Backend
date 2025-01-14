// Model me Post collection se related saare function for req and response and buisness logic will be here and route all function to post routes-------------------------

let PostCollection = require("../models/PostCollection");


// create a post for current logged in user in post controller middleware---------

const createPost = async (req, res) => {
//    res.send("Post created successfully");
      let {title, description, file} = req.body;
      let userId = req.user;

      if (!title) {
        return res.json({msg: "Please provide title for yout post", success: false})
      }


      try {
        let data = await PostCollection.create({
            title,
            description,
            file,
            userId
          });

          res.json({msg: "Post successfully uploaded", success: true})
      } catch (error) {
          res.json({msg: "Failed to upload a post", success: false, error: error.message})
      }
      
      
};


// update a post for for user which is currently logged through post controller middleware--------------

const updatePost = async (req, res) => {
    res.send("Post updated successfully");
};


// delete a post for current logged in user through post controller middleware-------------------------


const deletePost = async (req, res) => {
    res.send("Post deleted successfully");
};



// get all the post in our data to show for users as scrolling feature----------------------

const getAllPost = async (req, res) => {
    // res.send("All Post successfully");
    try {
        let post = (await PostCollection.find().sort({createdAt: -1}).populate({path: "userId", select: "name profilePic"}).populate({path: "comments", populate: {path: "user", select: "name profilePic"}}));
        res.json({msg: "All Posts here", success: true, post})
    } catch (error) {
        res.json({msg: "Failed to fetch posts", success: false})
    }
};


// get all the post for current logged user ----------------
const getYourAllPosts = async (req, res) => {

    let userId = req.user
  try {
     
    let posts = await PostCollection.find({userId: userId}).populate({path: "userId", select: "name profilePic"}).populate({path: "comments", populate: {path: "user", select: "name profilePic"}}).sort({createdAt: -1});

    res.json({msg: "your all posts here", success: true, posts})


    
  } catch (error) {
     res.json({msg: "Error in fetchingyour posts", success: false, error: error.message})
  }
}

// for comment a post ----------------
const commentPost = async (req, res) => {
    let userId = req.user;
    let postId = req.params.postId;
    let {text} = req.body;

    // let post = await PostCollection.findById(postId);

  if (text) {
    try {
        await PostCollection.findByIdAndUpdate(postId, {$push: {comments: {
            user: userId,
            text: text
        }}});
        res.json({msg: "Comment added successfully", success: true});
    } catch (error) {
        res.json({msg: "Failed to Comment!", success: false ,error: error.message})
    }
  }
  else {
    return res.json({msg: "Please Comment Something!!!", success: false})
  }
    
   
}

// get all the post for viewing that friend ---------------

const getFriendAllPosts = async (req, res) => {
    let userId = req.params._id;

    try {
          
        let data = await PostCollection.find({userId:userId}).sort({createdAt: -1}).populate({path: "comments", populate: {path: "user", select: "name profilePic"}});

        res.json({msg: "Search User Posts", success: true, data})
    } catch (error) {
        res.json({msg: "Failed to get Search User Posts", success: false, error: error.message})
    }
}

// for delete a comment of that user in post-------------
const deleteComment = async (req, res) => {
    let { commentId, postId } = req.params;


    try {
        let findPost = await PostCollection.findById(postId);
        let filteredArray = findPost.comments.filter(ele => ele._id.toString() !== commentId);
     
        await PostCollection.findByIdAndUpdate(postId, {$set: {comments: filteredArray}});
     
        res.json({msg: "Comment deleted Successfully", success: true});
    } catch (error) {
        res.json({msg: "Failed to delete a comment", success: false, error: error.message})
    }

  
}

// foe likes and dislike features -------------------
const likePost = async (req, res) => {
    let postId = req.params.postId;
    let userId = req.user;

    let findPost = await PostCollection.findById(postId);
    // console.log(findPost);

    try {
        if (findPost.likes.includes(userId)) {
            await PostCollection.findByIdAndUpdate(postId, {$pull: {likes: userId}})
            return res.json({msg: "Post Disliked successfully", success: true})
        }
        else {
            await PostCollection.findByIdAndUpdate(postId, {$push: {likes: userId}})
            return res.json({msg: "Post Liked successfully", success: true})
        }
    } catch (error) {
            res.json({msg: "Failed to Perform Action", success: false, error: error.message})
    }

   
}

const getPostById = async (req, res) => {
  let postId = req.params.postId;
  try {
    let findPost = await PostCollection.findById(postId).populate({path: "userId", select: "name profilePic"}).populate({path: "comments", populate: {path: "user", select: "name profilePic"}});
    res.json({msg: "Post find successfully", success: true, findPost})
  } catch (error) {
    res.json({msg: "Failed to get Post", success: false, error: error.message})
  }
}

// here we exports all the function and call them in post routes as api part---------------------


module.exports = {
    createPost, 
    updatePost,
    deletePost,
    getAllPost,
    getYourAllPosts,
    getFriendAllPosts,
    commentPost,
    deleteComment,
    likePost,
    getPostById
};