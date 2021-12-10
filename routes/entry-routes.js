const express = require("express");
const entryController = require("../controllers/entry-controller");
const router = express.Router();

router.get("/", (req, res) => {
  entryController.entry_index(req, res);
});

module.exports = router;
