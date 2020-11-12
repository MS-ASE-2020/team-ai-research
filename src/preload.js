const {
    contextBridge,
    ipcRenderer
} = require("electron");

const { app } = require("electron").remote;

const db = require("./db");
const filesystem = require("./filesys");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

window.ipcRenderer = require('electron').ipcRenderer;
window.api = {
  version_info: process.versions,
  database: db,
  filesystem: filesystem,
  userDataDir: app.getPath('userData')
};
