const EXPRESS = require("express");
const PATH = require("path");
const APP = EXPRESS();
const PORT = 3000;

APP.use(EXPRESS.static(__dirname + "/views"));

APP.get("/", (req, res) => {
  res.sendFile(PATH.join(__dirname + "/views/index.html"));
});

APP.get("/login", (req, res) => {
  res.sendFile(PATH.join(__dirname + "/views/login.html"));
});

APP.get("/signup", (req, res) => {
  res.sendFile(PATH.join(__dirname + "/views/signup.html"));
});

APP.get("/entries", (req, res) => {
  res.sendFile(PATH.join(__dirname + "/views/main.html"));
});

APP.listen(PORT);
