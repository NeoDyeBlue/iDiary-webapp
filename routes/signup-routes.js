const express = require("express");
const signupController = require("../controllers/signup-controller");
const router = express.Router();

router.get("/", (req, res) => {
  signupController.signup_index(req, res);
});

module.exports = router;
