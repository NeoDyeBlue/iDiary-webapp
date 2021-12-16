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
  // console.log(final);
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
        JSON.stringify({ content: uploadContent }),
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

async function update(userId, req) {
  let final = { success: false };
  try {
    let query = `UPDATE entry SET EntryTitle = ?, EntryContent = ? WHERE EntryId = ${req.params.entry} AND EntryUserID = ${userId}`;
    console.log(req.fields.type);
    if (req.fields.type == "text") {
      console.log("text");
      await db
        .execute(query, [
          req.fields.title,
          JSON.stringify({ content: req.fields.content }),
        ])
        .then((result) => {
          final.success = true;
          final.updatedItemId = req.params.entry;
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (req.fields.type == "image") {
      let keep = JSON.parse(req.fields.toRetain).content;
      let public_ids = [];
      let uploadContent = null;
      let toRemove = JSON.parse(req.fields.toRemove).content;
      console.log(keep);
      //delete
      if (toRemove.length) {
        toRemove.forEach((img) => {
          public_ids.push(img.id);
        });

        await cloudinary.api
          .delete_resources([public_ids])
          .then((result) => {
            console.log(result);
          })
          .catch((error) => console.log(error));
      }

      // console.log(files, req.files);
      //new
      if (req.files) {
        await upload_images(userId, req.files).then((result) => {
          uploadContent = result;
        });
      }

      uploadContent.forEach((content) => {
        keep.push(content);
      });

      await db
        .execute(query, [req.fields.title, JSON.stringify({ content: keep })])
        .then((result) => {
          final.success = true;
          final.updatedItemId = req.params.entry;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (err) {
    console.log(err);
  }
  return final;
}

async function delete_entry(userId, req) {
  let typeContentQuery = `SELECT ContentType, EntryContent FROM entry WHERE EntryID = ${req.params.entry} AND EntryUserID = ${userId}`;
  let typeContent = { type: null, content: null };

  await db.execute(typeContentQuery).then((result) => {
    let [data] = result;
    typeContent.type = data[0].ContentType;
    typeContent.content = data[0].EntryContent;
  });

  if (typeContent) console.log(typeContent);
}

async function upload_images(userId, files) {
  let uploadResults = [];
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
            uploadResults.push({
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
    // console.log(uploadResults);
    return uploadResults;
  });
}

module.exports = {
  read_all,
  read_one,
  create_text,
  create_image,
  update,
  delete_entry,
};
