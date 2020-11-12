const fs = require('fs');
const process = require('process');
const path = require('path');

try {
    let to = process.argv[process.argv.length - 1];
    for (let i = 2; i < process.argv.length - 1; i++) {
        let from = process.argv[i];
        let to_with_filename = path.join(to, path.basename(from));
        console.log(`Copying ${from} ---> ${to_with_filename}`);
        fs.copyFileSync(from, to_with_filename);
    }
} catch (e) {
    console.error("Copy failed! Error:", e);
    process.exit(1);
}
