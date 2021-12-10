const path = require("path");

const signup_index = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
};

module.exports = {
  signup_index,
};
