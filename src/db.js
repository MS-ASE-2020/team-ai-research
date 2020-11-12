const Database = require('better-sqlite3');
const DB_FILE = "papera.db";
const process = require('process');
const path = require('path');

function connectDatabase(directory = "./") {
  const db_file = path.join(directory, DB_FILE);
  try {
    var db = new Database(db_file, {verbose: console.log, fileMustExist: true});
  } catch (error) {
    db = new Database(db_file, {verbose: console.log});
    /*
    * `paper` entity table
    * - `ID`: using the "rowid" technic of SQlite3
    * - `keywords`: a list of keywords seperated by some special charactor
    * - `lastedit`: use TEXT datatype for date-time info, see https://www.sqlitetutorial.net/sqlite-date/
    * - `QandA`: Question&Answer notes of this paper
    * - `annotations`
    */
    db.prepare(`CREATE TABLE paper(
                  ID INTEGER PRIMARY KEY,
                  name TEXT UNIQUE NOT NULL,
                  title TEXT NOT NULL,
                  keywords TEXT,
                  year INTEGER,
                  conference TEXT,
                  lastedit TEXT,
                  QandA,
                  annotations
                );`).run();
    /*
    * `folder` entity table
    * - `ID`: using the "rowid" technic of SQlite3
    * - `createtime`: use TEXT datatype for date-time info, see https://www.sqlitetutorial.net/sqlite-date/
    */
    db.prepare(`CREATE TABLE folder(
                  ID INTEGER PRIMARY KEY,
                  name TEXT NOT NULL,
                  description TEXT,
                  createtime TEXT,
                  fatherID INTEGER,
                  FOREIGN KEY (fatherID) REFERENCES folder (ID)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                  UNIQUE(name, fatherID)
                );`).run();
    /*
    * `paperInFolder` relation table
    */
    db.prepare(`CREATE TABLE paperInFolder(
                  paperID INTEGER,
                  folderID INTEGER,
                  FOREIGN KEY (paperID) REFERENCES paper (ID)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                  FOREIGN KEY (folderID) REFERENCES folder (ID)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                  PRIMARY KEY (paperID, folderID)
                );`).run();
    /*
    * insert an explict root directory, so that the UNIQUE constraint in table `folder` works well for subdirectorys of '/'
    */
    db.prepare(`INSERT INTO folder VALUES (1, '/', 'root', datetime('now','localtime'), null);`).run();

    db.prepare(`CREATE UNIQUE INDEX idx_paper_name ON paper (name);`).run();
  }

  process.on('exit', () => db.close());
  return db;
}

function closeDatabase(db) {
  db.close();
}

/**
 * Save annotations, Q&As and/or other properties into table `paper`,
 * no matter whether or not it is new for papera.
 * Set `properties.ID` to `null`/`undefined`/`false` for paper creation.
 * @param { BetterSqlite3.Database } db 
 * @param {{ID: Number, name: String, title: String, keywords: String, year: Number, conference: String, lastedit: String, QandA, annotations}} properties 
 * @returns ID of created/updated paper.
 * @throws error object thrown by SQlite.
 */
function savePaper(db, properties) {
  let sqlStmt;
  if (properties.ID) {
    sqlStmt = db.prepare(`UPDATE paper
                          SET name = @name,
                          title = @title,
                          keywords = @keywords,
                          year = @year,
                          conference = @conference,
                          lastedit = @lastedit,
                          QandA = @QandA,
                          annotations = @annotations;`);
  } else {
    sqlStmt = db.prepare(`INSERT INTO paper (name, title, keywords, year, conference, lastedit, QandA, annotations)
                      VALUES (@name, @title, @keywords, @year, @conference, @lastedit, @QandA, @annotations);`);
  }
  try {
    db.transaction(() => {
      sqlStmt.run(properties);
    })();
    if (!properties.ID) {
      properties.ID = db.prepare(`SELECT ID FROM paper WHERE name = ?;`).get(properties.name).ID;
    }
  } catch (error) {
    console.error(error)
    throw error;
  }
  return properties.ID;
}

/**
 * List papers in a specific folder with given folder ID.
 * List all papers in papera when `folderID` is `null` or `false` or `undefined`
 * @param { BetterSqlite3.Database } db 
 * @param { Number } folderID 
 * @returns { Array< { ID:Number, name:String } > }
 * @throws error object thrown by SQlite.
 */
function listPaper(db, folderID) {
  let sqlStmt;
  if (folderID) {
    sqlStmt = db.prepare(`SELECT ID, name FROM paper
                          WHERE ID IN (
                            SELECT paperID from paperInFolder
                            WHERE folderID = ?
                          );`).bind(folderID);
  } else {
    sqlStmt = db.prepare(`SELECT ID, name FROM paper;`);
  }
  try {
    var result = sqlStmt.run(properties).all();
  } catch (error) {
    console.error(error)
    throw error;
  }
  return result;
}

function getAnnotation(db, paperID) {
  let sqlStmt = db.prepare(`SELECT annotations FROM paper WHERE ID = ?`);
  try {
    var result = sqlStmt.get(paperID).annotations
  } catch (error) {
    console.error(error)
    throw error;
  }
  return result;
}

module.exports = {
  connect: connectDatabase,
  close: closeDatabase,
  savePaper: savePaper,
  listPaper: listPaper,
  getAnnotation: getAnnotation
};
