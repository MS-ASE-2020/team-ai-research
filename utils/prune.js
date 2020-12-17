const path = require("path");
const os = require("os");
const process = require("process");
const fs = require("fs");
const packageJSON = require("../package.json");
const name = packageJSON.name;

const platform = os.platform();
let appData;
let userData;

switch (platform) {
  case 'win32':
    appData = process.env.APPDATA;
    if (!appData) {
      throw "Envvar %APPDATA% not properly set. Exiting.";
    }
    break;
  case 'darwin':
    appData = "~/Library/Application Support";
    break;
  default:
    appData = process.env.XDG_CONFIG_HOME;
    if (!appData) {
      throw "Envvar $XDG_CONFIG_HOME not properly set. Exiting.";
    }
}

userData = path.join(appData, name);

console.log(`Userdata is at ${userData}.`);

if (!fs.existsSync(userData)) {
  console.log("This folder does not exist. There's no need to prune.");
  process.exit(0);
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
 
readline.question('Remove (y/N)? ', choice => {
  if (choice === 'y') {
    fs.rmdirSync(userData, {
      recursive: true
    });
    console.log("Done.");
  } else {
    console.log("Exit now.");
  }
  readline.close();
});
