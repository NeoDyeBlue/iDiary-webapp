const path = require("path");
const entryDB = require("../models/entry");

const entry_index = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main.html"));
};

const entry_all = async (req, res) => {
  let result = await entryDB.read(req.user.userId);
  res.json({ result });
};

module.exports = {
  entry_index,
  entry_all,
};
