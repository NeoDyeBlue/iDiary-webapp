const express = require("express");
const homeController = require("../controllers/home-controller");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", user_auth, (req, res) => {
  homeController.home_index(req, res);
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
