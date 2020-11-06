const sqlite3 = require('sqlite3').verbose();
const DB_FILE = "papera.db";

function connectDatabase() {
  try {
    var db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
      if (error) {
        console.error(error)
        throw error
      }
    });
  } catch (error) {
    return (null, error)
  }
  db.serialize(() => {
    /*
     *  `paper` entity table
     *  - `paperID`: using the "rowid" technic of SQlite3
     *  - `paperLastedit`: use TEXT datatype for date-time info, see https://www.sqlitetutorial.net/sqlite-date/
     *  - `paperQA`: Question&Answer notes of this paper. Notice that this is a sub-table property.
     *  - `paperMarks`
     */
    db.run(`CREATE TABLE IF NOT EXISTS paper(
              paperID INTEGER PRIMARY KEY,
              paperName TEXT UNIQUE NOT NULL,
              paperTitle TEXT NOT NULL,
              paperKeywords TEXT,
              paperYear INTEGER,
              paperConference TEXT,
              paperLastedit TEXT,
              paperQA,
              paperMarks
            );`)
    /*
     *  `folder` entity table
     *  - `folderID`: using the "rowid" technic of SQlite3
     *  - `folderCreatetime`: use TEXT datatype for date-time info, see https://www.sqlitetutorial.net/sqlite-date/
     */
      .run(`CREATE TABLE IF NOT EXISTS folder(
              folderID INTEGER PRIMARY KEY,
              folderName TEXT NOT NULL,
              folderDescription TEXT,
              folderCreatetime TEXT,
              folderFatherID INTEGER,
              FOREIGN KEY (folderFatherID) REFERENCES folder (folderID)
                ON DELETE CASCADE ON UPDATE CASCADE,
              UNIQUE(folderName, folderFatherID)
            );`)
    /*
     *  `paperInFolder` relation table
     */
      .run(`CREATE TABLE IF NOT EXISTS paperInFolder(
              PIFpaperID INTEGER,
              PIFfolderID INTEGER,
              FOREIGN KEY (PIFpaperID) REFERENCES paper (paperID)
                ON DELETE CASCADE ON UPDATE CASCADE,
              FOREIGN KEY (PIFfolderID) REFERENCES folder (folderID)
                ON DELETE CASCADE ON UPDATE CASCADE,
              PRIMARY KEY (PIFpaperID, PIFfolderID)
            );`)
  })
  return (db, null);
}

function closeDatabase(db) {
  db.close((e) => {
    if (e)
      return console.error(e)
  });
}

module.exports = {
  connect: connectDatabase,
  close: closeDatabase
};
