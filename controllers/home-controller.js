const path = require("path");

const home_index = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
};

module.exports = {
  home_index,
};
