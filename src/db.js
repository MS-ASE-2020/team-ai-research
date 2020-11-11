const Database = require('better-sqlite3');
const DB_FILE = "papera.db";
const process = require('process');

function connectDatabase() {
  var db = new Database(DB_FILE, { verbose: console.log });
  process.on('exit', () => db.close());

  /*
   *  `paper` entity table
   *  - `paperID`: using the "rowid" technic of SQlite3
   *  - `paperLastedit`: use TEXT datatype for date-time info, see https://www.sqlitetutorial.net/sqlite-date/
   *  - `paperQA`: Question&Answer notes of this paper. Notice that this is a sub-table property.
   *  - `paperMarks`
   */
  db.prepare(`CREATE TABLE IF NOT EXISTS paper(
                paperID INTEGER PRIMARY KEY,
                paperName TEXT UNIQUE NOT NULL,
                paperTitle TEXT NOT NULL,
                paperKeywords TEXT,
                paperYear INTEGER,
                paperConference TEXT,
                paperLastedit TEXT,
                paperQA,
                paperMarks
              );`).run();
  /*
   *  `folder` entity table
   *  - `folderID`: using the "rowid" technic of SQlite3
   *  - `folderCreatetime`: use TEXT datatype for date-time info, see https://www.sqlitetutorial.net/sqlite-date/
   */
  db.prepare(`CREATE TABLE IF NOT EXISTS folder(
                folderID INTEGER PRIMARY KEY,
                folderName TEXT NOT NULL,
                folderDescription TEXT,
                folderCreatetime TEXT,
                folderFatherID INTEGER,
                FOREIGN KEY (folderFatherID) REFERENCES folder (folderID)
                  ON DELETE CASCADE ON UPDATE CASCADE,
                UNIQUE(folderName, folderFatherID)
              );`).run();
  /*
   *  `paperInFolder` relation table
   */
  db.prepare(`CREATE TABLE IF NOT EXISTS paperInFolder(
                PIFpaperID INTEGER,
                PIFfolderID INTEGER,
                FOREIGN KEY (PIFpaperID) REFERENCES paper (paperID)
                  ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (PIFfolderID) REFERENCES folder (folderID)
                  ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY (PIFpaperID, PIFfolderID)
              );`).run();

  db.prepare(`INSERT OR IGNORE INTO folder VALUES (0, '/', 'root', '', null);`).run();

  return db;
}

function closeDatabase(db) {
  db.close();
}

function example(db) {
  const insert = db.prepare('INSERT INTO paper (paperName, paperTitle) VALUES (@name, @title)');

  const insertMany = db.transaction((papers) => {
    for (const paper of papers) insert.run(paper);
  });

  insertMany([
    { name: 'test1', title: '2' },
    { name: 'test2', title: '3' },
    { name: 'test3', title: '4' },
  ]);
}

module.exports = {
  connect: connectDatabase,
  close: closeDatabase
};
