const express = require("express");
const loginController = require("../controllers/login-controller");
const router = express.Router();

router.get("/", (req, res) => {
  loginController.login_index(req, res);
});

router.post("/", async (req, res) => {
  loginController.login_auth(req, res);
});

module.exports = router;
