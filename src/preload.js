// const {
//   contextBridge,
//   ipcRenderer
// } = require("electron");

const { app, dialog, getCurrentWebContents } = require("electron").remote;
const { FindInPage } = require("electron-find");

const db = require("./db");
const filesystem = require("./filesys");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

window.ipcRenderer = require('electron').ipcRenderer;
window.api = {
  version_info: process.versions,
  database: db,
  filesystem: filesystem,
  userDataDir: app.getPath('userData'),
  getFindInPage: (element) => new FindInPage(getCurrentWebContents(), {
    parentElement: element
  }),
  openFile: null  // filled in App.js
};

// overwrite alert and confirm, as they stuck in electron
window.alert = (detail) => {
  const options = {
    type: 'warning',
    buttons: ['OK'],
    defaultId: 0,
    cancelId: 0,
    detail: detail,
    message: ''
  };
  dialog.showMessageBoxSync(null, options);
};

window.confirm = (detail) => {
  const options = {
    type: 'question',
    buttons: ['OK', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
    detail: detail,
    message: ''
  };
  const buttonIdx = dialog.showMessageBoxSync(null, options);
  return buttonIdx === 0;
};

// openFile IPC
window.ipcRenderer.on("openFile", (event, message) => {
  console.log(message);
  window.api.openFile(message);
});
