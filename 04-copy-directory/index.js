const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const copyDirPath = path.join(__dirname, 'files-copy');
const pathFrom = path.join(__dirname, 'files');

const copyPaste = async function () {
  try {
    fsPromises.rm(copyDirPath, { recursive: true, force: true }).then(async () => {
      const createDir = await fsPromises.mkdir(copyDirPath, { recursive: true });
      await copyDir(pathFrom).then(console.log("Здравствуйте, папка files скопирована в папку files-copy"));
    })

  }
  catch (err) {
    console.log(err);
  }
}();


const copyDir = async function (pathFrom) {
  try {
    let files = await fsPromises.readdir(pathFrom, { withFileTypes: true });
    files.forEach(file => {
      if (file.isDirectory()) {
        fsPromises.mkdir(path.join(pathFrom.replace('files', 'files-copy'), file.name), { recursive: true });
        copyDir(path.join(pathFrom, file.name));
      } else {
        fsPromises.copyFile(path.join(pathFrom, file.name), path.join(pathFrom.replace('files', 'files-copy'), file.name));
      }
    });
  }
  catch (err) {
    console.log(err);
  }
}
