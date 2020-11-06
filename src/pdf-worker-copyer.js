const fs = require('fs');
const process = require('process');

try {
    fs.copyFileSync('node_modules/pdfjs-dist/build/pdf.worker.min.js', 'src/pdf.worker.min.data');
} catch (e) {
    console.error("Cannot copy pdf.js worker file! Error:", e);
    process.exit(1);
}
