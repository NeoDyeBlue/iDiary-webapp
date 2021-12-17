const express = require("express");
const bodyParser = require("body-parser");
const formidable = require("express-formidable");
const cookieParser = require("cookie-parser");
const path = require("path");
// const bcrypt = require("bcrypt");
const homeRoutes = require("./routes/home-routes");
const userRoutes = require("./routes/user-routes");
const signupRoutes = require("./routes/signup-routes");
const entryRoutes = require("./routes/entry-routes");
const app = express();
const port = 3000;

// console.log(bcrypt.hashSync("passwordtest", 10));
// app.use(express.json());
// for parsing application/json
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(formidable({ multiples: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/public")));

app.use(homeRoutes);
app.use("/users", [formidable({ multiples: true })], userRoutes);
// app.use("/login", [bodyParser.json()], loginRoutes);
// app.use("/signup", [bodyParser.json()], signupRoutes);
app.use("/entries", [formidable({ multiples: true })], entryRoutes);

app.listen(port);
