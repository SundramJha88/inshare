const router = require("express").Router();
const User = require("../models/user.js");

router.get("/signup", (req, res) => {
  res.render("signup", {
    error: req.flash("error"),
    success: req.flash("signupSuccess")
  });
});

router.post("/signup", async (req, res) => {
  try {
    const { createToken } = require("../auth/userAuth");
    const { name, email, username, password } = req.body;

    // Input validation
    if (!name || !email || !username || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/signup");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.flash("error", "Please enter a valid email address");
      return res.redirect("/signup");
    }

    // Username validation (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      req.flash("error", "Username can only contain letters, numbers and underscores");
      return res.redirect("/signup");
    }

    // Password strength validation
    if (password.length < 6) {
      req.flash("error", "Password must be at least 6 characters long");
      return res.redirect("/signup");
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        req.flash("error", "Email already registered");
      } else {
        req.flash("error", "Username already taken");
      }
      return res.redirect("/signup");
    }

    // Create new user
    const saveUser = new User({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });

    await saveUser.save();

    // Create JWT token
    createToken({ username: username.toLowerCase() }, "0.5h", res);

    req.flash("success", "Signup successful! Welcome to InShare");
    res.redirect("/share");
  } catch (err) {
    console.error("Unable to signup", err);
    req.flash(
      "error",
      "An error occurred during signup. Please try again."
    );
    res.redirect("/signup");
  }
});

module.exports = router;
