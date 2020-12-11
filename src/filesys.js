const fs = require("fs");
const path = require("path");
const supportedHTTPProtocols = {
  "http:": require('http'),
  "https:": require('https')
};
const url = require("url");

let targetFolder = null;

function initFolder(userDataDir) {
  targetFolder = path.join(userDataDir, "/papers");
  if (!fs.existsSync(targetFolder))
    fs.mkdirSync(targetFolder);
  // not elegant but I guess now we have no race condition here...
}

function savePaper(src, id) {
  console.log(src, id);
  return new Promise((resolve, reject) => {
    if (src.startsWith('file://')) {
      src = decodeURI(src.replace('file://', ''));
      fs.copyFileSync(src, path.join(targetFolder, id + ".pdf"));
      resolve();
    } else {
      // download from web
      // async
      const parsed = url.parse(src);
      const http_lib = supportedHTTPProtocols[parsed.protocol || "http:"];
      if (http_lib) {
        const file = fs.createWriteStream(path.join(targetFolder, id + ".pdf"));
        http_lib.get(src, response => {
          response.pipe(file);
          resolve();
        });
      } else {
        reject("Unsupported protocol!");
      }
    }
  });
}

function getPaperPath(id) {
  id = id.toString();
  return path.join(targetFolder, id + ".pdf");
}

function moveTmpToPaperID(id) {
  fs.renameSync(path.join(targetFolder, "tmp.pdf"), path.join(targetFolder, id + ".pdf"));
}

module.exports = {
  init: initFolder,
  get: getPaperPath,
  save: savePaper,
  moveTmp: moveTmpToPaperID
};