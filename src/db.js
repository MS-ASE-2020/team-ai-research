const sqlite3 = require('sqlite3').verbose();
const DB_FILE = "papera.db";

function connectDatabase() {
  var db;
  (new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE, e => e ? reject(e) : resolve());
  })).catch(e => {
    db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, e => {
      if (e) {
        console.error(e);
        throw e;
      }
      db.serialize(() => {
        /*
         *  `paper` entity table
         *  - `ID`: using the "rowid" technic of SQlite3
         *  - `keywords`: a list of keywords seperated by some special charactor
         *  - `lastedit`: use TEXT datatype for date-time info, see https://www.sqlitetutorial.net/sqlite-date/
         *  - `QandA`: Question&Answer notes of this paper
         *  - `annotations`
         */
        db.run(`CREATE TABLE paper(
                  ID INTEGER PRIMARY KEY,
                  name TEXT UNIQUE NOT NULL,
                  title TEXT NOT NULL,
                  keywords TEXT,
                  year INTEGER,
                  conference TEXT,
                  lastedit TEXT,
                  QandA,
                  annotations
                );`, e => {
                  if (e) {
                    console.error(e);
                    throw e;
                  }
                })
        /*
         *  `folder` entity table
         *  - `ID`: using the "rowid" technic of SQlite3
         *  - `createtime`: use TEXT datatype for date-time info, see https://www.sqlitetutorial.net/sqlite-date/
         */
          .run(`CREATE TABLE folder(
                  ID INTEGER PRIMARY KEY,
                  name TEXT NOT NULL,
                  description TEXT,
                  createtime TEXT,
                  fatherID INTEGER,
                  FOREIGN KEY (fatherID) REFERENCES folder (ID)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                  UNIQUE(name, fatherID)
                );`, e => {
                  if (e) {
                    console.error(e);
                    throw e;
                  }
                })
        /*
         *  `paperInFolder` relation table
         */
          .run(`CREATE TABLE paperInFolder(
                  paperID INTEGER,
                  folderID INTEGER,
                  FOREIGN KEY (paperID) REFERENCES paper (ID)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                  FOREIGN KEY (folderID) REFERENCES folder (ID)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                  PRIMARY KEY (paperID, folderID)
                );`, e => {
                  if (e) {
                    console.error(e);
                    throw e;
                  }
                })
        /*
         *  insert an explict root directory, so that the UNIQUE constraint in table `folder` works well for subdirectorys of '/'
         */
          .run(`INSERT INTO folder VALUES (0, '/', 'root', datetime('now','localtime'), null);`, e => {
            if (e) {
              console.error(e);
              throw e;
            }
          });
      });
    })
  })
  return db;
}

function closeDatabase(db) {
  db.close((e) => {
    if (e) {
      console.error(e);
      throw e;
    }
  });
}

function example(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run('SELECT * FROM PAPER');

      db.run('END TRANSACTION', error => {
        if (error) {
          return reject(error);
        }

        return resolve();
      });
    })
  });
}

module.exports = {
  connect: connectDatabase,
  close: closeDatabase
};
