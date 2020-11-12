const fs = require("fs");
const path = require("path");

let targetFolder = null;

function initFolder(userDataDir) {
    targetFolder = path.join(userDataDir, "/papers");
    if (!fs.existsSync(targetFolder))
        fs.mkdirSync(targetFolder);
    // not elegant but I guess now we have no race condition here...
}

function savePaper(src, id) {
    console.log(src, id);
}

module.exports = {
    init: initFolder,
    save: savePaper
};