const router = require("express").Router();
const { signin } = require("../auth/userAuth");

router.get("/login", (req, res) => {
  res.render("login", {
    error: req.flash("error"),
    success: req.flash("success")
  });
});

router.post("/login", signin);

router.get("/logout", (req, res) => {
  res.clearCookie('token');
  req.flash("success", "Logout Successfull");
  res.redirect("/");
});

module.exports = router;