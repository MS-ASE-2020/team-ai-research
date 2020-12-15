const electron = require('electron');
const { protocol } = require('electron');
// const { ipcMain } = require('electron');

protocol.registerSchemesAsPrivileged([
  { scheme: 'paper', privileges: { supportFetchAPI: true } }
]);

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Bypass the node-sqlite3 bug in electron (https://github.com/mapbox/node-sqlite3/issues/1370)
app.allowRendererProcessReuse = false;

function isDev() {
  if (process.env.DEV) return true;
  return false;
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      // worldSafeExecuteJavaScript: true,
      contextIsolation: false,
      preload: path.join(__dirname, "/preload.js"),
      webSecurity: false,
      webviewTag: true,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  // if ELECTRON_START_URL is set (by electron-wait-react.js), use that,
  // else, we are on production, and then use compiled build/index.html

  mainWindow.loadURL(startUrl);
  // Open the DevTools.
  if (isDev())
    mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Load devtools
if (isDev()) {
  var { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
  // use var to let installExtension and REACT_DEVELOPER_TOOLS not destroyed
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });
  protocol.registerFileProtocol('paper', (request, callback) => {
    const pathname = path.join(app.getPath('userData'), 'papers', request.url.replace('paper://', '') + '.pdf');
    console.log(pathname);
    callback(pathname);
  });
  if (isDev()) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
});
