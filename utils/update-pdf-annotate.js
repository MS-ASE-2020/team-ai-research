const fs = require('fs').promises;
const process = require('process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

(async function() {
  try {
    console.log("Deleting old pdf-annotate.js in node_modules...");
    await fs.rmdir("node_modules/pdf-annotate.js", { recursive: true });
  } catch (e) {
    console.error("Cannot remove pdf-annotate.js directory! Error:", e);
    console.error("Note: Your node.js version should be >= 12.10.0");
    process.exit(1);
  }
  try {
    console.log("Running npm install, this may take some time...");
    await exec('npm install');
  } catch (e) {
    console.error("An error happened when running npm install! Error:", e);
    process.exit(1);
  }
})();
