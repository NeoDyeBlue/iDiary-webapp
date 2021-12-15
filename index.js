const express = require("express");
const bodyParser = require("body-parser");
const formidable = require("express-formidable");
const cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const homeRoutes = require("./routes/home-routes");
const loginRoutes = require("./routes/login-routes");
const signupRoutes = require("./routes/signup-routes");
const entryRoutes = require("./routes/entry-routes");
const app = express();
const port = 3000;

// console.log(bcrypt.hashSync("passwordtest", 10));
// app.use(express.json());
// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(formidable({ multiples: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/public")));

app.use(homeRoutes);
app.use("/login", loginRoutes);
app.use("/signup", signupRoutes);
app.use("/entries", entryRoutes);

app.listen(port);
