const fs = require("fs");
const path = require("path");
const https = require("https");

let targetFolder = null;

function initFolder(userDataDir) {
    targetFolder = path.join(userDataDir, "/papers");
    if (!fs.existsSync(targetFolder))
        fs.mkdirSync(targetFolder);
    // not elegant but I guess now we have no race condition here...
}

function savePaper(src, id) {
    console.log(src, id);
    if (src.startsWith('file://')) {
        src = decodeURI(src.replace('file://', ''));
        fs.copyFileSync(src, path.join(targetFolder, id + ".pdf"));
    } else {
        // download from web
        // async
        const file = fs.createWriteStream(path.join(targetFolder, id + ".pdf"));
        const request = https.get(src, response => {
            response.pipe(file);
        });
    }
}

function getPaperPath(id) {
    id = id.toString();
    return path.join(targetFolder, id + ".pdf");
}

module.exports = {
    init: initFolder,
    get: getPaperPath,
    save: savePaper
};