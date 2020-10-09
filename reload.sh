#!/bin/sh

# run when https://github.com/taoky/pdf-annotate.js updates.

rm package-lock.json
rm -r node_modules/pdf-annotate.js
npm install
npm run webpack