const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    req.flash("error", "Access denied. Please login.");
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (err) {
    req.flash("error", "Invalid or expired token. Please login again.");
    return res.redirect("/signup");
  }
};