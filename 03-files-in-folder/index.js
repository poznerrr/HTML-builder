const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const KILO = 1000;
const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  files.forEach(file => {
    if (!file.isDirectory()) {
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      fsPromises.stat(filePath).then(fileStat =>
        console.log(`${path.basename(filePath).replace(path.extname(filePath), '')} - ${path.extname(filePath).replace('.', '')} - ${fileStat.size / KILO}kb`)
      );
    }
  });
}
);