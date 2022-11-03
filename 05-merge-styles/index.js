const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const fileBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const dirStylesPath = path.join(__dirname, 'styles');


bundleStyles();
console.log('bundle.css создан');


async function bundleStyles() {
  await fsPromises.rm(fileBundle, { force: true });
  await fsPromises.writeFile(fileBundle, '');

  fs.readdir(dirStylesPath, { withFileTypes: true }, (err, files) => {
    files.forEach(file => {
      if (!file.isDirectory()) {
        const filePath = path.join(dirStylesPath, file.name);
        if (path.extname(filePath) === '.css') {
          appendFromBundle(file, filePath);
        }
      }
    });
  }
  );
};

async function appendFromBundle(file, filePath) {
  const data = await fsPromises.readFile(filePath, { encoding: 'utf-8' });
  await fsPromises.appendFile(fileBundle, data.trim() + '\r\n', { encoding: 'utf-8' });
}