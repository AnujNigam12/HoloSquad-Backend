let ShareCollection = require("../models/ShareCollection");

const sendMedia = async (req, res) => {    
      const { recipient, sender, media } = req.body;

      if (!recipient) {
        return res.json({msg: "Please provide recipient for sharing media", success: false})
      }
      if (!sender) {
        return res.json({msg: "Please provide sender for sharing media", success: false})
      }
      if (!media) {
        return res.json({msg: "Please provide media for sharing media", success: false})
      }

      try {
        let data = await ShareCollection.create({
            recipient, 
            sender, 
            media
          });

          res.json({msg: "Media shared successfully", success: true})
      } catch (error) {
          res.json({msg: "Error in sharing media", success: false, error: error.message})
      }
};

const recieveMedia = async (req, res) => {
  try {
      const share = await ShareCollection.find({ recipient : req.params.userId })
          .sort({ createdAt: -1 })
          .limit(50); // Limit results for performance
      res.status(200).json(share);
  } catch (error) {
      res.status(500).json({ msg: "Error in fetching Media", success: false, error: error.message});
  }
};


// here we exports all the function and call them in notification routes as api part---------------------
module.exports = {
    sendMedia,
    recieveMedia
};