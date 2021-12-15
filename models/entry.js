require("dotenv").config();
const db = require("./database");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
// const formidable = require("formidable");
// const form = formidable({ multiples: true });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function read_all(userId) {
  try {
    // let connection = db.getConnection();
    let userQuery = `SELECT UserFirstName as 'firstName', UserLastName as 'lastName', UserEmail as 'email', UserImage as 'image' FROM user WHERE UserID = '${userId}'`;
    let entryQuery = `SELECT entry.EntryID, entry.EntryDateTime, entry.EntryTitle, entry.ContentType, entry.EntryContent 
    FROM entry WHERE EntryUserID = '${userId}' ORDER BY entry.EntryDateTime DESC`;

    let [user] = await db.execute(userQuery);
    let [result] = await db.execute(entryQuery);

    let final = {
      user: {
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
        image: user[0].image,
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
  let final = {};
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
        final.entries = [
          {
            date,
            dateEntries: [
              {
                entryId: data[0].EntryID,
                title: data[0].EntryTitle,
                time,
                type: data[0].ContentType,
                content: JSON.parse(data[0].EntryContent).content,
              },
            ],
          },
        ];
      })
      .catch((err) => {
        final.success = false;
      });
  } catch (err) {
    final.success = false;
  }
  console.log(final);
  return final;
}

async function create_text(userId, body) {
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
  } catch (err) {
    final.error = JSON.parse(err);
  }
  return final;
}

async function create_image(userId, req) {
  let final = { success: false };
  try {
    let query = `INSERT INTO entry (EntryUserID, EntryDateTime, EntryTitle, ContentType, EntryContent) VALUES (?, NOW(), ?, ?, ?)`;
    let uploadContent = null;
    let inputFields = req.fields;
    // let result = await upload_images(userId, req.files);

    await upload_images(userId, req.files).then((result) => {
      uploadContent = result;
    });

    await db
      .execute(query, [
        userId,
        inputFields.title,
        inputFields.type,
        JSON.stringify(uploadContent),
      ])
      .then((result) => {
        final.success = true;
        final.entryId = result[0].insertId;
      })
      .catch((err) => {
        console.log(err);
        final.message = "an error occured";
      });
  } catch (err) {
    console.log("err here");
    console.log(err);
    final.message = "an error occured";
  }
  return final;
}

async function upload_images(userId, files) {
  let uploadResults = { content: [] };
  let uploadPromises = [];

  if (!Array.isArray(files.images)) {
    files.images = [files.images];
  }

  try {
    files.images.forEach((image) => {
      uploadPromises.push(
        cloudinary.uploader
          .upload(image.path, {
            folder: `idiary/entries/${userId}`,
            quality: "auto:low",
          })
          .then((result) => {
            console.log(result);
            uploadResults.content.push({
              id: result.public_id,
              url: result.url,
            });
          })
          .catch((err) => {
            console.log(err);
          })
      );
    });
    // let values = [userId, body.title, body.type, content];
  } catch (err) {
    console.log(err);
  }

  return await Promise.all(uploadPromises).then(() => {
    console.log("done");
    // console.log(uploadResults);
    return uploadResults;
  });
}

module.exports = {
  read_all,
  read_one,
  create_text,
  create_image,
};
