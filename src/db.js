const sqlite3 = require('sqlite3').verbose();
const DB_FILE = "papera.db";

export function connectDatabase() {
  return new sqlite3.Database(DB_FILE);
}

export default {
  connect: connectDatabase,
}