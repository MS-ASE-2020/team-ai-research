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
    db.prepare(`INSERT INTO folder VALUES (1, '', 'root', datetime('now','localtime'), null);`).run();

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
 * Property `lastedit` will be automatically set by SQlite3.
 * @param { BetterSqlite3.Database } db 
 * @param {{ID: Number, name: String, title: String, keywords: String, year: Number, conference: String, QandA, annotations}} properties 
 * @param { function } [afterwardsFunction]
 * @returns ID of created/updated paper.
 * @throws error object thrown by SQlite, and should be handled by upper caller.
 *         Mostly because:
 *         - some other paper have the same name
 */
function savePaper(db, properties, afterwardsFunction = null) {
  function getNewID() {
    return db.prepare(`SELECT ID FROM paper WHERE name = ?;`).get(properties.name).ID;
  }
  let sqlStmt;
  if (properties.ID) {
    sqlStmt = db.prepare(`UPDATE paper
                          SET name = @name,
                              title = @title,
                              keywords = @keywords,
                              year = @year,
                              conference = @conference,
                              lastedit = datetime('now','localtime'),
                              QandA = @QandA,
                              annotations = @annotations
                          WHERE ID = @ID;`);
  } else {
    sqlStmt = db.prepare(`INSERT INTO paper (name, title, keywords, year, conference, lastedit, QandA, annotations)
                      VALUES (@name, @title, @keywords, @year, @conference, datetime('now','localtime'), @QandA, @annotations);`);
  }

  db.transaction(() => {
    sqlStmt.run(properties);
    if (afterwardsFunction) {
      afterwardsFunction(getNewID());
    }
  })();
  if (!properties.ID && !afterwardsFunction) {
    properties.ID = getNewID();
  }
  return properties.ID;
}

/**
 * Save properties into table `folder`,
 * no matter whether or not it is new for papera.
 * Set `properties.ID` to `null`/`undefined`/`false` for folder creation.
 * Property `createtime` will be automatically set by SQlite3.
 * @param { BetterSqlite3.Database } db 
 * @param {{ID: Number, name: String, description: String, fatherID: Number}} properties 
 * @returns ID of created/updated folder.
 * @throws error object thrown by SQlite, and should be handled by upper caller.
 *         Mostly because:
 *         - some other folder have the same name within the same father folder
 *         - illegal `properties.fatherID`
 */
function saveFolder(db, properties) {
  function getNewID() {
    return db.prepare(`SELECT ID FROM folder WHERE name = ? and fatherID = ?;`).get(properties.name, properties.fatherID).ID;
  }
  let sqlStmt;
  if (properties.ID) {
    sqlStmt = db.prepare(`UPDATE folder
                          SET name = @name,
                              description = @description,
                              fatherID = @fatherID
                          WHERE ID = @ID;`);
  } else {
    sqlStmt = db.prepare(`INSERT INTO folder (name, description, createtime, fatherID)
                          VALUES (@name, @description, datetime('now','localtime'), @fatherID);`);
  }

  db.transaction(() => {
    sqlStmt.run(properties);
  })();
  if (!properties.ID) {
    properties.ID = getNewID();
  }

  return properties.ID;
}


/**
 * List papers in a specific folder with given folder ID.
 * List all papers in papera when `folderID` is `null` or `false` or `undefined`
 * @param { BetterSqlite3.Database } db 
 * @param { Number } folderID 
 * @returns { Array< { ID:Number, name:String } > }
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
  var result = sqlStmt.all();
  return result;
}

/**
 * List folders in a specific folder with given father folder ID.
 * When `folderID` is null or 0 or undefined, the return array's length will be 0.
 * @param {BetterSqlite3.Database} db 
 * @param {Number} folderID 
 * @returns { Array< { ID:Number, name:String } > }
 */
function listFolder(db, folderID) {
  let sqlStmt = db.prepare(`SELECT ID, name FROM folder
                            WHERE fatherID = ?;`);
  if (folderID) {
    var result = sqlStmt.all(folderID);
  } else {
    result = Array();
  }
  return result;
}

/**
 * 
 * @param {BetterSqlite3.Database} db 
 * @param {Number} folderID 
 * @returns {{ID: Number, name: String, description: String, createtime: String, fatherID: Number}}
 */
function getFolderProperty(db, folderID) {
  let sqlStmt = db.prepare(`SELECT ID, name, description, createtime, fatherID
                            FROM folder WHERE ID = ?`);
  var result = sqlStmt.get(folderID);
  return result;
}

function getAnnotation(db, paperID) {
  let sqlStmt = db.prepare(`SELECT annotations FROM paper WHERE ID = ?`);
  var result = sqlStmt.get(paperID).annotations;
  return result;
}

function getQandA(db, paperID) {
  let sqlStmt = db.prepare(`SELECT QandA FROM paper WHERE ID = ?`);
  var result = sqlStmt.get(paperID).QandA;
  return result;
}

/**
 * 
 * @param {BetterSqlite3.Database} db 
 * @param {Number} paperID 
 * @returns {{ID: Number, name: String, title: String, keywords: String, year: Number, conference: String, lastedit: String}}
 */
function getPaperProperty(db, paperID) {
  let sqlStmt = db.prepare(`SELECT ID, name, title, keywords, year, conference, lastedit
                            FROM paper WHERE ID = ?`);
  var result = sqlStmt.get(paperID);
  return result;
}

module.exports = {
  connect: connectDatabase,
  close: closeDatabase,
  savePaper: savePaper,
  listPaper: listPaper,
  getAnnotation: getAnnotation,
  listFolder: listFolder,
  getQandA: getQandA,
  getPaperProperty: getPaperProperty,
  getFolderProperty: getFolderProperty,
  saveFolder: saveFolder
};
