const path = require("path");
const entryDB = require("../models/entry");

const entry_index = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main.html"));
};

const entry_all = (req, res) => {
  // let result = await entryDB.read(req.user.userId);
  entryDB.read_all(req.user.userId).then((data) => {
    // console.log(data);
    res.json(data);
  });

  // res.json({ result });
};

const entry_read_one = (req, res) => {
  entryDB.read_one(req.user.userId, req.params.entry).then((data) => {
    // console.log(data);
    res.json(data);
  });
};

const entry_update = (req, res) => {
  entryDB.update(req.user.userId, req).then((data) => {
    // console.log(data);
    res.json(data);
  });
};

const entry_add_text = (req, res) => {
  entryDB.create_text(req.user.userId, req.fields).then((data) => {
    res.json(data);
  });
};

const entry_upload_images = (req, res) => {
  entryDB.create_image(req.user.userId, req).then((data) => {
    res.json(data);
  });
};

const entry_delete = (req, res) => {
  entryDB.delete_entry(req.user.userId, req).then((data) => {
    res.json(data);
  });
};

module.exports = {
  entry_index,
  entry_all,
  entry_read_one,
  entry_update,
  entry_add_text,
  entry_upload_images,
  entry_delete,
};
