const {
    contextBridge,
    ipcRenderer
} = require("electron");

const db = require("./db");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

window.ipcRenderer = require('electron').ipcRenderer;
window.api = {
  version_info: process.versions,
  database: db,
};
