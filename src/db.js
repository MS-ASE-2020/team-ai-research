const Database = require('better-sqlite3');
const DB_FILE = "papera.db";
const process = require('process');
const path = require('path');

/**
 * 
 * @param {String} str 
 * @returns {Array<String>}
 */
function parseString(str) {
  return JSON.parse(str);
}

/**
 * 
 * @param { Array< String > } arr
 * @returns {String}
 */
function stringifyArray(arr) {
  return JSON.stringify(arr);
}

function connectDatabase(directory = "./") {
  const db_file = path.join(directory, DB_FILE);
  try {
    var db = new Database(db_file, {verbose: console.log});
    /**
     * `paper` entity table
     * - `ID`: using the "rowid" technic of SQlite3
     * - `keywords`: a list of keywords seperated by some special charactor
     * - `lastedit`: use TEXT datatype for date-time info, see https://www.sqlitetutorial.net/sqlite-date/
     * - `QandA`: Question&Answer notes of this paper
     * - `annotations`
     */
    db.prepare(`CREATE TABLE IF NOT EXISTS paper(
                  ID INTEGER PRIMARY KEY,
                  name TEXT UNIQUE NOT NULL,
                  title TEXT NOT NULL,
                  keywords TEXT,
                  year INTEGER,
                  conference TEXT,
                  lastedit TEXT,
                  QandA,
                  annotations,
                  content TEXT
                );`).run();
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_paper_name ON paper (name);`).run();
    /**
     * `folder` entity table
     * - `ID`: using the "rowid" technic of SQlite3
     * - `createtime`: use TEXT datatype for date-time info, see https://www.sqlitetutorial.net/sqlite-date/
     */
    db.prepare(`CREATE TABLE IF NOT EXISTS folder(
                  ID INTEGER PRIMARY KEY,
                  name TEXT NOT NULL,
                  description TEXT,
                  createtime TEXT,
                  fatherID INTEGER,
                  FOREIGN KEY (fatherID) REFERENCES folder (ID)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                  UNIQUE(name, fatherID)
                  CHECK (fatherID != 1 OR name != 'All papers')
                );`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_folder_fatherID ON folder (fatherID);`).run();
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_folder_name_fatherID ON folder (name, fatherID);`).run();
    /**
     * `paperInFolder` relation table
     */
    db.prepare(`CREATE TABLE IF NOT EXISTS paperInFolder(
                  paperID INTEGER,
                  folderID INTEGER,
                  FOREIGN KEY (paperID) REFERENCES paper (ID)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                  FOREIGN KEY (folderID) REFERENCES folder (ID)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                  PRIMARY KEY (paperID, folderID)
                );`).run();
    /**
     * Virturl table based on SQlite3 FTS5, for database full-text search.
     * Triggers should be created, or operations should be done inside JS, in order to handle:
     * - AFTER INSERT ON paper:
     *   - insert paper's properties into paperAndFolderForSearch, leaving folder properties NULL.
     * - AFTER INSERT ON paperInFolder:
     *   - delete every row in paperAndFolderForSearch where pID matches NEW.paperID but fID is null
     *   - insert paper and folder's properties into paperAndFolderForSearch
     * - AFTER UPDATE ON paper:
     *   - update every row in paperAndFolderForSearch to NEW where OLD.ID matches pID
     * - AFTER UPDATE ON folder:
     *   - update every row in paperAndFolderForSearch to NEW where OLD.ID matches fID
     * - AFTER UPDATE ON paperInFolder:
     *   - SHOULD BE HANDLED BUT NOT POSSIBLE TO HAPPEN CURRENTLY
     * - AFTER DELETE ON paper
     *   - delete every row in paperAndFolderForSearch where OLD.ID matches pID
     * - AFTER DELETE ON paperInFolder
     *   - if (SELECT count(*) FROM paperAndFolderForSearch WHERE OLD.paperID = pID AND OLD.folderID != fID) >= 1
     *       DELETE FROM paperAndFolderForSearch WHERE OLD.paperID = pID AND OLD.folderID = fID
     *     else
     *       UPDATE paperAndFolderForSearch SET properties.of.folder=NULL WHERE OLD.paperID = pID
     */
    db.prepare(`CREATE VIRTUAL TABLE IF NOT EXISTS paperAndFolderForSearch
                USING fts5(
                  pID UNINDEXED, pName, pTitle, pKeywords, pYear, pConference, pLastedit, pQandA, pAnnotations, pContent,
                  fID UNINDEXED, fPath, fDescription, fCreatetime, fFatherID UNINDEXED
                );`).run();

    /**
     * insert an explict root directory, so that the UNIQUE constraint in table `folder` works well for subdirectorys of '/'
     */
    db.prepare(`INSERT OR IGNORE INTO folder VALUES (1, '', 'root', datetime('now','localtime'), null);`).run();
  } catch(error) {
    console.error(error);
    throw error;
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
 * @param {{ID: Number, name: String, title: String, keywords: String, year: Number, conference: String, QandA, annotations, content}} properties 
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
  let fts5TableStmt;
  if (properties.ID) {
    sqlStmt = db.prepare(`
      UPDATE paper
      SET
        name = @name,
        title = @title,
        keywords = @keywords,
        year = @year,
        conference = @conference,
        lastedit = datetime('now','localtime'),
        QandA = @QandA,
        annotations = @annotations
      WHERE
        ID = @ID;
    `);
    fts5TableStmt = db.prepare(`
      UPDATE paperAndFolderForSearch
      SET
        pName = @name,
        pTitle = @title,
        pKeywords = @keywords,
        pYear = @year,
        pConference = @conference,
        pLastedit = datetime('now','localtime'),
        pQandA = @QandA,
        pAnnotations = @annotations
      WHERE
        pID = @ID;
    `);
  } else {
    sqlStmt = db.prepare(`INSERT INTO paper (name, title, keywords, year, conference, lastedit, QandA, annotations, content)
                          VALUES (@name, @title, @keywords, @year, @conference, datetime('now','localtime'), @QandA, @annotations, @content);`);
    fts5TableStmt = db.prepare(`
      INSERT INTO paperAndFolderForSearch
      VALUES (@ID, @name, @title, @keywords, @year, @conference, datetime('now','localtime'), @QandA, @annotations, @content,
              NULL, NULL, NULL, NULL, NULL);
    `);
  }

  db.transaction(() => {
    sqlStmt.run(properties);
    if (!properties.ID) {
      properties.ID = getNewID();
    }
    fts5TableStmt.run(properties);
    if (afterwardsFunction) {
      afterwardsFunction(properties.ID);
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
  let fts5TableStmt;
  if (properties.ID) {
    sqlStmt = db.prepare(`
      UPDATE folder
      SET name = @name,
          description = @description
      WHERE ID = @ID;
    `);
    fts5TableStmt = db.prepare(`
      UPDATE paperAndFolderForSearch
      SET fPath = @path,
          fDescription = @description
      WHERE fID = @ID;
    `);
  } else {
    sqlStmt = db.prepare(`INSERT INTO folder (name, description, createtime, fatherID)
                          VALUES (@name, @description, datetime('now','localtime'), @fatherID);`);
  }

  db.transaction(() => {
    sqlStmt.run(properties);
    if (properties.ID) {
      let path = getFolderPath(db, properties.ID);
      fts5TableStmt.run({path: path, description: properties.description, ID: properties.ID});
    }
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
function listPaper(db, folderID, recursive=false) {
  let sqlStmt;
  if (folderID) {
    let folderIDs = [folderID,];
    if (recursive) {
      folderIDs = folderIDs.concat( listFolder(db, folderID, recursive).map(x => x.ID) );
    }
    let sql = `SELECT ID, name FROM paper
               WHERE ID IN (
                 SELECT paperID from paperInFolder
                 WHERE folderID IN (`
              + folderIDs.map(x => String(x)).join(',')
              + "));";
    sqlStmt = db.prepare(sql);
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
function listFolder(db, folderID, recursive=false) {
  var result = [];
  if (folderID) {
    let fatherIDs = [folderID, ];
    do {
      let str = "(" + fatherIDs.map(x => String(x)).join(',') + ")";
      let childFolders = db.prepare(`SELECT ID, name FROM folder WHERE fatherID IN` + str + `;`).all();
      fatherIDs = childFolders.map(x => x.ID);
      result = result.concat(childFolders);
    } while (recursive && fatherIDs.length > 0);
  }
  return result;
}

function getAnnotation(db, paperID) {
  let sqlStmt = db.prepare(`SELECT annotations FROM paper WHERE ID = ?;`);
  var result = sqlStmt.get(paperID).annotations;
  return result;
}

function getQandA(db, paperID) {
  let sqlStmt = db.prepare(`SELECT QandA FROM paper WHERE ID = ?;`);
  var result = sqlStmt.get(paperID).QandA;
  return result;
}

/**
 * 
 * @param {BetterSqlite3.Database} db 
 * @param {Number} paperID 
 * @returns {{ID: Number, name: String, title: String, keywords: String, year: Number, conference: String, lastedit: String, QandA, annotations, content}}
 */
function getPaperProperty(db, paperID) {
  let sqlStmt = db.prepare(`SELECT ID, name, title, keywords, year, conference, lastedit, QandA, annotations, content
                            FROM paper WHERE ID = ?;`);
  var result = sqlStmt.get(paperID);
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
                            FROM folder WHERE ID = ?;`);
  var result = sqlStmt.get(folderID);
  return result;
}

/**
 * Get the full path of the folder with given folderID.
 * Return null when folderID is `null` or 0 or `undefined`.
 * @param {BetterSqlite3.Database} db 
 * @param {Number} folderID 
 * @returns {String} Full path of the folder
 */
function getFolderPath(db, folderID) {
  let path = "";
  while (folderID) {
    let folder = db.prepare(`SELECT name, fatherID FROM folder WHERE ID = ?;`).get(folderID);
    path = folder.name + "/" + path;
    folderID = folder.fatherID;
  }
  if (path === "")
    path = null;
  return path;
}

function deletePaper(db, paperID) {
  let sqlStmt = db.prepare(`DELETE FROM paper WHERE ID = ?;`).bind(paperID);
  let fts5TableStmt = db.prepare(`DELETE FROM paperAndFolderForSearch WHERE pID = ?;`).bind(paperID);
  db.transaction(() => {
    sqlStmt.run();
    fts5TableStmt.run();
  })();
}

function deleteFolder(db, folderID) {
  let sqlStmt = db.prepare(`DELETE FROM folder WHERE ID = ?;`).bind(folderID);
  let pIDarr = db.prepare(`
    SELECT paperID FROM paperInFolder
    WHERE paperID IN (
      SELECT paperID from paperInFolder
      WHERE folderID = ?
    )
    GROUP BY paperID
    HAVING COUNT(*) = 1;
  `).bind(folderID).all();
  let str = '(' + pIDarr.map(x => String(x.paperID)).join(',') + ')';
  let fts5TableStmtDelete = db.prepare(`DELETE FROM paperAndFolderForSearch WHERE fID = ? AND pID NOT IN ${str};`).bind(folderID);
  let fts5TableStmtUpdate = db.prepare(`
    UPDATE paperAndFolderForSearch
    SET fID = NULL,
        fPath = NULL,
        fDescription = NULL,
        fCreatetime = NULL,
        fFatherID = NULL
    WHERE fID = ? AND pID IN ${str};
  `).bind(folderID);
  db.transaction(() => {
    sqlStmt.run();
    fts5TableStmtDelete.run();
    fts5TableStmtUpdate.run();
  })();
}

/**
 * List folders in which a specific paper with `paperID` exists.
 * @param {BetterSqlite3.Database} db 
 * @param {Number} paperID 
 * @returns { Array< { ID:Number, path:String } > }
 */
function listFolderOfPaper(db, paperID) {
  let sqlStmt = db.prepare(`SELECT folderID FROM paperInFolder
                            WHERE paperID = ?;`);
  return sqlStmt.all(paperID).map(x => {
    return {ID: x.folderID, path: getFolderPath(db, x.folderID)};
  });
}

/**
 * Make a specific paper with `paperID` be in folders given an array of folderIDs.
 * @param {BetterSqlite3.Database} db 
 * @param {Number} paperID 
 * @param { Array< Number > } folderIDs
 * @throws error object thrown by SQlite3
 */
function saveFolderOfPaper(db, paperID, folderIDs) {
  let paperProperty = getPaperProperty(db, paperID);
  let sqlStmtInsert, fts5TableStmtInsert, fts5TableStmtBlankDelete;
  if (folderIDs && folderIDs.length >= 1){
    let sql = `INSERT INTO paperInFolder VALUES `+ folderIDs.map(folderID => `(${paperID},${folderID})`).join(',') + ';';
    sqlStmtInsert = db.prepare(sql);
    let insertValues = folderIDs.map(folderID => {
      let folderProperty = getFolderProperty(db, folderID);
      let path = getFolderPath(db, folderID);
      return [
        paperProperty.ID,
        paperProperty.name,
        paperProperty.title,
        paperProperty.keywords,
        paperProperty.year,
        paperProperty.conference,
        paperProperty.lastedit,
        paperProperty.QandA,
        paperProperty.annotations,
        paperProperty.content,
        folderProperty.ID,
        path,
        folderProperty.description,
        folderProperty.createtime,
        folderProperty.fatherID
      ];
    });
    let strPlaceholders = folderIDs.map(() => "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").join(',');
    fts5TableStmtBlankDelete = db.prepare(`
      DELETE FROM paperAndFolderForSearch
      WHERE pID = ? AND fID IS NULL;
    `).bind(paperID);
    fts5TableStmtInsert = db.prepare(`
      INSERT INTO paperAndFolderForSearch
      VALUES ` + strPlaceholders + `;
    `).bind(...insertValues);
  }
  let sqlStmtDelete = db.prepare(`DELETE FROM paperInFolder WHERE paperID = ?;`).bind(paperID);
  let fts5TableStmtDelete = db.prepare(`
    DELETE FROM paperAndFolderForSearch
    WHERE pID = ?;
  `).bind(paperID);
  let fts5TableStmtBlankInsert = db.prepare(`
    INSERT INTO paperAndFolderForSearch
    VALUES (@ID, @name, @title, @keywords, @year, @conference, @lastedit, @QandA, @annotations, @content,
            NULL, NULL, NULL, NULL, NULL);
  `).bind(paperProperty);
  db.transaction(() => {
    sqlStmtDelete.run();
    fts5TableStmtDelete.run();
    fts5TableStmtBlankInsert.run();
    if (sqlStmtInsert) {
      sqlStmtInsert.run();
      fts5TableStmtBlankDelete.run();
      fts5TableStmtInsert.run();
    }
  })();
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
  saveFolder: saveFolder,
  deletePaper: deletePaper,
  deleteFolder: deleteFolder,
  listFolderOfPaper: listFolderOfPaper,
  saveFolderOfPaper: saveFolderOfPaper,
  parseString: parseString,
  stringifyArray: stringifyArray,
  getFolderPath: getFolderPath,
};
