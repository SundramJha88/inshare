const User = require("../models/user.js");
const jwt = require('jsonwebtoken'); 
const bcrypt = require("bcryptjs");

const signin = async (req,res,next) =>{
  try {
    const { usernameOrEmail, password } = req.body;

    const fetchUser = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!fetchUser) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/signin");
    }

    const isMatch = await bcrypt.compare(password, fetchUser.password);

    if (!isMatch) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/signin");
    }
    createToken({ username: fetchUser.username }, '0.5h', res); 

    req.flash("success", "Login successful!");
    return res.redirect("/submitresult");
  } catch (err) {
    req.flash("error", "An error occurred during login.");
    console.log(err);
    return res.redirect("/signin");
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