// const { reject } = require("bcrypt/promises");
require("dotenv").config();
const { AvatarGenerator } = require("random-avatar-generator");
const db = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
// const res = require("express/lib/response");
const generator = new AvatarGenerator();

async function create(body) {
  let auth = { a0: false };
  try {
    let exists = false;
    let checkExistQuery = `SELECT UserID FROM user WHERE UserEmail = '${body.email}'`;
    let query =
      "INSERT INTO user (UserEmail, UserPassword, UserFirstName, UserLastName) VALUES (?, ?, ?, ?)";
    let imageQuery =
      "UPDATE user SET UserImageID = ?, UserImage = ? WHERE UserID = ?";
    let password = null;
    let imageId = null;
    let imageUrl = null;
    let newId = null;
    await db.execute(checkExistQuery).then((result) => {
      [data] = result;
      if (data.length) {
        exists = true;
      }
    });

    if (exists) {
      return auth;
    } else {
      await bcrypt.hash(body.password, 10).then((result) => {
        password = result;
      });

      await db
        .execute(query, [body.email, password, body.firstName, body.lastName])
        .then((result) => {
          newId = result[0].insertId;
        })
        .catch((err) => {
          console.log(err);
        });

      await cloudinary.uploader
        .upload(generator.generateRandomAvatar(), {
          folder: `idiary/users/${newId}`,
          quality: "auto:low",
        })
        .then((result) => {
          imageId = result.public_id;
          imageUrl = result.url;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    await db
      .execute(imageQuery, [imageId, imageUrl, newId])
      .then((result) => {
        auth.a0 = true;
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
  return auth;
}

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

async function updatePhoto(userId, req) {}

async function updateName(userId, body) {
  let final = { success: false };
  console.log("call");
  try {
    let query =
      "UPDATE user SET UserFirstName = ?, UserLastName = ? WHERE UserID = ?";

    await db
      .execute(query, [body.firstName, body.lastName, userId])
      .then((result) => {
        final.success = true;
        final.message = "name updated successfuly";
      })
      .catch((error) => {
        console.log(error);
        final.message = "an error occured in the database";
      });
  } catch (err) {
    console.log(err);
    final.message = "an error occured";
  }
  return final;
}

async function updateEmail(userId, body) {
  let final = { success: false };
  try {
    let exists = false;
    let query = "UPDATE user SET UserEmail = ? WHERE UserID = ?";
    let checkExistQuery = `SELECT UserID FROM user WHERE UserEmail = '${body.email}'`;

    await db.execute(checkExistQuery).then((result) => {
      [data] = result;
      if (data.length) {
        exists = true;
        final.message = "email is already used";
      }
    });

    if (exists) {
      return final;
    } else {
      await db
        .execute(query, [body.email, userId])
        .then((result) => {
          final.success = true;
          final.message = "email updated successfuly";
        })
        .catch((error) => {
          final.message = "an error occured in the database";
        });
    }
  } catch (err) {
    final.message = "an error occured";
  }
  return final;
}

async function updatePassword(userId, body) {
  final = { success: false };
  try {
    let password = null;
    let query = `UPDATE user SET UserPassword = ? WHERE UserId = ?`;
    await bcrypt.hash(body.password, 10).then((result) => {
      password = result;
    });

    await db
      .execute(query, [password, userId])
      .then((result) => {
        final.success = true;
        final.message = "password updated successfuly";
      })
      .catch((error) => {
        final.message = "an error occured in the database";
      });
  } catch (err) {
    final.message = "an error occured";
  }
  return final;
}

module.exports = {
  read,
  create,
  updatePhoto,
  updateName,
  updateEmail,
  updatePassword,
};
