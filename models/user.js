const { reject } = require("bcrypt/promises");
require("dotenv").config();
const db = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function create(req) {}

async function read(body) {
  try {
    const auth = {
      user: { token: null, a0: false },
      result: { a1: false, a2: false },
    };
    const { email, password } = body;
    let idQuery = `SELECT user.UserID FROM user WHERE user.UserEmail = '${email}'`;

    let [idResult] = await db.execute(idQuery);
    if (idResult[0]) {
      let { UserID } = idResult[0];
      auth.result.a1 = true;

      let pwQuery = `SELECT user.UserPassword FROM user WHERE user.UserID = '${UserID}'`;
      let [pwResult] = await db.execute(pwQuery);
      let { UserPassword } = pwResult[0];
      if (await bcrypt.compare(password, UserPassword)) {
        auth.result.a2 = true;
        auth.user.a0 = true;
        auth.user.token = jwt.sign(
          { userId: UserID },
          process.env.JWT_AT_SECRET
        );
      }
    }
    return auth;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  read,
};
