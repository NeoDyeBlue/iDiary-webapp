require("dotenv").config();
const db = require("./database");
const jwt = require("jsonwebtoken");

async function read(id) {
  try {
    let [user] = await db.execute(
      `SELECT UserFirstName as 'firstName', UserLastName as 'lastName' FROM user WHERE UserID = '${id}'`
    );
    let query = `SELECT entry.EntryID, 
    entry.EntryDateTime, entry.EntryTitle, entry.EntryContent 
    FROM entry WHERE EntryUserID = '${id}'`;
    let [result] = await db.execute(query);
    let final = {
      firstName: user.firstName,
      lastName: user.lastName,
      entries: [],
    };
    result.forEach((res) =>
      console.log(new Date(res.EntryDateTime).toLocaleDateString())
    );
    console.log(result);
    return result;
  } catch (err) {
    return err;
  }
}

module.exports = {
  read,
};
