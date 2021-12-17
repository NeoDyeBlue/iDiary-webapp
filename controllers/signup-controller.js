const path = require("path");
const userDB = require("../models/user");

const signup_index = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
};

const signup_new = (req, res) => {
  userDB.create(req.body).then((result) => {
    res.json(result);
  });
};

module.exports = {
  signup_index,
  signup_new,
};
