const express = require("express");
const userController = require("../controllers/user-controller");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/login", user_auth, (req, res) => {
  console.log("get login");
  userController.login_index(req, res);
});

router.post("/login", user_auth, (req, res) => {
  console.log("post login");
  userController.login_auth(req, res);
});

router.get("/signup", user_auth, (req, res) => {
  console.log("get signup");
  userController.signup_index(req, res);
});

router.post("/signup", user_auth, (req, res) => {
  console.log("post signup");
  userController.signup_new(req, res);
});

router.get("/logout", (req, res) => {
  userController.logout_user(req, res);
});

router.post("/photo", (req, res) => {
  console.log("post/photo");
  userController.update_photo(req, res);
});

router.post("/name", (req, res) => {
  console.log("post/name");
  userController.update_name(req, res);
});

router.post("/email", (req, res) => {
  console.log("post/email");
  userController.update_email(req, res);
});

router.post("/password", (req, res) => {
  console.log("post/pass");
  userController.update_photo(req, res);
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

function updates_auth(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_AT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
      return res.redirect("/entries");
    }
    next();
  });
}

module.exports = router;
