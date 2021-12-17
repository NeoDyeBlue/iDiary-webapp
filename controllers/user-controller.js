const path = require("path");
const userDB = require("../models/user");

const login_index = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
};

const login_auth = async (req, res) => {
  // console.log(req.fields);
  let result = await userDB.read(req.fields);
  if (result.user.a0) {
    res
      .cookie("token", result.user.token, {
        // expires: new Date(Date.now() + 1200),
        secure: false,
        httpOnly: true,
      })
      .status(200)
      .json({ auth: result.result });
  } else {
    res.status(401).json({ auth: result.result });
  }
};

const signup_index = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
};

const signup_new = (req, res) => {
  userDB.create(req.fields).then((result) => {
    res.json(result);
  });
};

const update_photo = (req, res) => {
  userDB.updatePhoto(req.user.userId, req).then((result) => {
    res.json(result);
  });
};

const update_name = (req, res) => {
  console.log(req);
  userDB.updateName(req.user.userId, req.fields).then((result) => {
    res.json(result);
  });
};

const update_email = (req, res) => {
  userDB.updateEmail(req.user.userId, req.fields).then((result) => {
    res.json(result);
  });
};

const update_password = (req, res) => {
  userDB.updatePassword(req.user.userId, req.fields).then((result) => {
    res.json(result);
  });
};

const logout_user = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  login_index,
  login_auth,
  signup_index,
  signup_new,
  update_photo,
  update_name,
  update_email,
  update_password,
  logout_user,
};
