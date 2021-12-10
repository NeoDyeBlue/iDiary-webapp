const path = require("path");
const userDB = require("../models/user");

const login_index = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
};

const login_auth = async (req, res) => {
  // console.log(req.body);
  let result = await userDB.read(req.body);
  if (result.user.a0) {
    res
      .cookie("token", result.user.token, {
        expires: new Date(Date.now() + 1200),
        secure: false,
        httpOnly: true,
      })
      .status(200)
      .json({ auth: result.result });
  } else {
    res.status(401).json({ auth: result.result });
  }
};

module.exports = {
  login_index,
  login_auth,
};
