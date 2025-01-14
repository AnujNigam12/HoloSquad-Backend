// middleware are function used to perform buisness logic in according to request and response and have access to them and work as action to perform then go to next ----------

var jwt = require('jsonwebtoken');

let JWT_secretKey = "akash@0410";

const checkToken = (req, res, next) => {
//   res.json("i am middleware");


try {

    let token  = req.headers.authorization;

    if (!token) {
      return  res.json({msg: "token not found", success: false})
    }
    
    var decoded = jwt.verify(token, JWT_secretKey);
    
    // console.log(decoded.id);
    
    req.user = decoded.id;
    next(); 
} catch (error) {
    res.json({msg: "Invalid token", success: false})
}




// console.log(token)
}




module.exports = checkToken;