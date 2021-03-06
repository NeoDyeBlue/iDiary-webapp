require("dotenv").config();
const express = require("express");
// const path = require("path");
const entryController = require("../controllers/entry-controller");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", user_auth, (req, res) => {
  entryController.entry_index(req, res);
});

router.get("/all", user_auth, (req, res) => {
  entryController.entry_all(req, res);
});

router.get("/:entry", user_auth, (req, res) => {
  entryController.entry_read_one(req, res);
});

router.post("/", user_auth, (req, res) => {
  entryController.entry_add_text(req, res);
});

router.post("/upload", user_auth, (req, res) => {
  entryController.entry_upload_images(req, res);
});

router.post("/:entry", user_auth, (req, res) => {
  entryController.entry_update(req, res);
});

router.delete("/:entry", user_auth, (req, res) => {
  entryController.entry_delete(req, res);
});

function user_auth(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_AT_SECRET, (err, user) => {
    if (err) return res.redirect("/users/login");
    req.user = user;
    next();
  });
}

module.exports = router;
