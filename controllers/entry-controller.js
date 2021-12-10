const path = require("path");

const entry_index = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main.html"));
};

module.exports = {
  entry_index,
};
