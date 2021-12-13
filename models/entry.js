require("dotenv").config();
const db = require("./database");
const jwt = require("jsonwebtoken");

async function read_all(userId) {
  try {
    // let connection = db.getConnection();
    let userQuery = `SELECT UserFirstName as 'firstName', UserLastName as 'lastName', UserEmail as 'email' FROM user WHERE UserID = '${userId}'`;
    let entryQuery = `SELECT entry.EntryID, entry.EntryDateTime, entry.EntryTitle, entry.ContentType, entry.EntryContent 
    FROM entry WHERE EntryUserID = '${userId}' ORDER BY entry.EntryDateTime DESC`;

    let [user] = await db.execute(userQuery);
    let [result] = await db.execute(entryQuery);

    let final = {
      user: {
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
      },
      entries: [],
    };

    result.forEach((res) => {
      try {
        let datetime = new Date(res.EntryDateTime);
        let initialDate = datetime.toLocaleDateString().split("/");
        let [day, month, year] = initialDate;
        let date = new Date(`${year}-${month}-${day}`).getTime();
        let time = new Date(datetime).getTime();
        if (!final.entries.length) {
          final.entries.push({
            date,
            dateEntries: [
              {
                entryId: res.EntryID,
                title: res.EntryTitle,
                time,
                type: res.ContentType,
                content: JSON.parse(res.EntryContent).content,
              },
            ],
          });
        } else {
          let existingIndex = final.entries.findIndex(
            (entry) => entry.date == date
          );
          if (existingIndex >= 0) {
            final.entries[existingIndex].dateEntries.push({
              entryId: res.EntryID,
              title: res.EntryTitle,
              time,
              type: res.ContentType,
              content: JSON.parse(res.EntryContent).content,
            });
          } else {
            final.entries.push({
              date,
              dateEntries: [
                {
                  entryId: res.EntryID,
                  title: res.EntryTitle,
                  time,
                  type: res.ContentType,
                  content: JSON.parse(res.EntryContent).content,
                },
              ],
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
    console.log("end");
    // console.log(final);
    // connection.release();
    return final;
  } catch (err) {
    // connection.release();
    return err;
  }
}

async function read_one(userId, entryId) {
  let final = { success: false };
  try {
    let query = `SELECT entry.EntryID, entry.EntryDateTime, entry.EntryTitle, entry.ContentType, entry.EntryContent 
    FROM entry WHERE EntryUserID = ${userId} AND EntryID = ${entryId}`;
    await db
      .execute(query)
      .then((result) => {
        let [data] = result;
        let datetime = new Date(data[0].EntryDateTime);
        let initialDate = datetime.toLocaleDateString().split("/");
        let [day, month, year] = initialDate;
        let date = new Date(`${year}-${month}-${day}`).getTime();
        let time = new Date(datetime).getTime();
        final.success = true;
        final.result = {
          entryId: data[0].entryID,
          date,
          time,
          type: data[0].ContentType,
          title: data[0].EntryTitle,
          content: JSON.parse(data[0].EntryContent).content,
        };
      })
      .catch((err) => {
        final.error = JSON.parse(err);
      });
  } catch (err) {
    final.error = JSON.parse(err);
  }
  console.log(final);
  return final;
}

async function create(userId, body) {
  let final = { success: false };
  try {
    let content = JSON.stringify({ content: body.content });
    console.log(content);
    let query = `INSERT INTO entry (EntryUserID, EntryDateTime, EntryTitle, ContentType, EntryContent) VALUES (?, NOW(), ?, ?, ?)`;
    let values = [userId, body.title, body.type, content];

    await db
      .execute(query, values)
      .then((result) => {
        final.success = true;
        final.entryId = result[0].insertId;
      })
      .catch((err) => {
        final.error = JSON.parse(err);
      });
    // let [data] = await db.execute(query, values);

    // try {
    //   final.success = true;
    //   final.entryId = data.insertId;
    // } catch (err) {
    //   final.error = err;
    // }
  } catch (err) {
    final.error = JSON.parse(err);
  }
  return final;
}

module.exports = {
  read_all,
  read_one,
  create,
};
