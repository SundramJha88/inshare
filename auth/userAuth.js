const User = require("../models/user.js");
const jwt = require('jsonwebtoken'); 
const bcrypt = require("bcryptjs");

const signin = async (req,res,next) =>{
  try {
    const { usernameOrEmail, password } = req.body;

    const fetchUser = await User.findOne({
      $or: [{ email: usernameOrEmail.toLowerCase() }, { username: usernameOrEmail.toLowerCase() }],
    });

    if (!fetchUser) {
      req.flash("error", "Wrong credentials");
      return res.redirect("/login");  
    }

    const isMatch = await bcrypt.compare(password, fetchUser.password);

    if (!isMatch) {
      req.flash("error", "Wrong credentials");
      return res.redirect("/login");  
    }
    
    createToken({ username: fetchUser.username, userId: fetchUser._id }, '24h', res);  

    // req.flash("success", "Login Successfull");

    return res.redirect("/share");
  } catch (err) {
    req.flash("error", "Unable to login at the moment");
    console.log(err);
    return res.redirect("/login");
  }
}

const createToken = (payload, expiry, res) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiry });
    res.cookie('token', token, { httpOnly: true, secure: process.env.PRO_MODE === 'true', sameSite : 'strict' });
    return token; 
  } catch (error) {
    console.error("Could not tokenize: ", error);
    throw new Error("Token generation failed");
  }
}
module.exports = {
  signin,
  createToken
};