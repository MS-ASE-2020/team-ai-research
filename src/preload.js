const {
    contextBridge,
    ipcRenderer
} = require("electron");

const db = require("./db");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// contextBridge.exposeInMainWorld(
//     "api", {
//         version_info: process.versions,
//         database: db,
//     }
// )

window.ipcRenderer = require('electron').ipcRenderer;
window.api = {}
window.api.version_info = process.versions;
window.api.database = db;