const express = require("express");
const homeController = require("../controllers/home-controller");
const router = express.Router();

router.get("/", (req, res) => {
  homeController.home_index(req, res);
});

module.exports = router;
