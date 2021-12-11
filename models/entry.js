require("dotenv").config();
const db = require("./database");
const jwt = require("jsonwebtoken");

async function read(id) {
  try {
    let userQuery = `SELECT UserFirstName as 'firstName', UserLastName as 'lastName' FROM user WHERE UserID = '${id}'`;
    let entryQuery = `SELECT entry.EntryID, entry.EntryDateTime, entry.EntryTitle, entry.ContentType, entry.EntryContent 
    FROM entry WHERE EntryUserID = '${id}' ORDER BY entry.EntryDateTime DESC`;

    let [user] = await db.execute(userQuery);
    let [result] = await db.execute(entryQuery);

    let final = {
      user: {
        firstName: user[0].firstName,
        lastName: user[0].lastName,
      },
      entries: [],
    };
    // console.log(final);
    // console.log(result);
    result.forEach((res) => {
      try {
        let datetime = new Date(res.EntryDateTime);
        let initialDate = datetime.toLocaleDateString().split("/");
        let [day, month, year] = initialDate;
        let date = new Date(`${year}-${month}-${day}`).getTime();
        let time = new Date(datetime).getTime();
        // console.log(new Date(date).toLocaleDateString());
        // console.log(new Date(date).getDate());
        if (!final.entries.length) {
          final.entries.push({
            date,
            dateEntries: [
              {
                entryId: res.EntryID,
                title: res.EntryTitle,
                time,
                type: res.ContentType,
                content: JSON.parse(res.EntryContent),
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
              content: JSON.parse(res.EntryContent),
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
                  content: JSON.parse(res.EntryContent),
                },
              ],
            });
          }
          // final.entries.forEach((entry) => {
          //   if (date == entry.date) {
          //     entry.dateEntries.push({
          //       entryId: res.EntryID,
          //       title: res.EntryTitle,
          //       time,
          //       type: res.ContentType,
          //       content: JSON.parse(res.EntryContent),
          //     });
          //   } else {
          //     console.log(res.EntryTitle, " ", date);
          //     final.entries.push({
          //       date,
          //       dateEntries: [
          //         {
          //           entryId: res.EntryID,
          //           title: res.EntryTitle,
          //           time,
          //           type: res.ContentType,
          //           content: JSON.parse(res.EntryContent),
          //         },
          //       ],
          //     });
          //   }
          // });
        }
      } catch (err) {
        console.log(err);
      }
    });
    console.log("end");
    // console.log(final);
    return final;
  } catch (err) {
    return err;
  }
}

module.exports = {
  read,
};
