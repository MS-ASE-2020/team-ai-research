const fs = require('fs');
const process = require('process');

try {
  let from = process.argv[2];
  let to = process.argv[3];
  console.log(`Copying ${from} ---> ${to}`);
  fs.copyFileSync(from, to);
} catch (e) {
  console.error("Copy failed! Error:", e);
  process.exit(1);
}
