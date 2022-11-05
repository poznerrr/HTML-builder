const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const dirDistPath = path.join(__dirname, 'project-dist');
const assetsToPath = path.join(__dirname, 'project-dist', 'assets');
const assetsFromPath = path.join(__dirname, 'assets');
const dirStylesPath = path.join(__dirname, 'styles');
const fileBundle = path.join(__dirname, 'project-dist', 'style.css');
const filePage = path.join(__dirname, 'project-dist', 'index.html');
const fileTemplate = path.join(__dirname, 'template.html');
const dirComponents = path.join(__dirname, 'components');

const doScript = async () => {
  await relaodDir(dirDistPath);
  await copyAssets(assetsFromPath, assetsToPath);
  await bundleStyles();
  await constructPage();
};
doScript();






async function relaodDir(dirPath) {
  await fsPromises.rm(dirPath, { force: true, recursive: true });
  await fsPromises.mkdir(dirPath, { recursive: true });
}

async function copyAssets(assetsFrom, assetsTo) {
  await relaodDir(assetsTo);
  await copyAssetsDir(assetsFrom);
}

async function copyAssetsDir(pathFrom) {
  let files = await fsPromises.readdir(pathFrom, { withFileTypes: true });
  files.forEach(file => {
    if (file.isDirectory()) {
      fsPromises.mkdir(path.join(pathFrom.replace('assets', 'project-dist/assets'), file.name), { recursive: true }).then(
        copyAssetsDir(path.join(pathFrom, file.name)));
    } else {
      fsPromises.copyFile(path.join(pathFrom, file.name), path.join(pathFrom.replace('assets', 'project-dist/assets'), file.name));
    }
  });
}

async function bundleStyles() {
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

async function constructPage() {
  await fsPromises.writeFile(filePage, '');
  let data = await fsPromises.readFile(fileTemplate, { encoding: 'utf-8' });
  const templates = data.match(/{{[^{}]*}}/g) || [];
  for (let i = 0; i < templates.length; i++) {
    let replacementPath = path.join(dirComponents, templates[i].replace('{{', '').replace('}}', '') + '.html');
    let replacement = await fsPromises.readFile(replacementPath, { encoding: 'utf-8' });
    data = data.replace(templates[i], replacement);
  }
  await fsPromises.appendFile(filePage, data, { encoding: 'utf-8' });
}
