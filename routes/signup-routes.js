const { signedCookie } = require("cookie-parser");
const express = require("express");
const signupController = require("../controllers/signup-controller");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", user_auth, (req, res) => {
  signupController.signup_index(req, res);
});

router.post("/", (req, res) => {
  signupController.signup_new(req, res);
});

function user_auth(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_AT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
      return res.redirect("/entries");
    }
    next();
  });
}

module.exports = router;
