const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const newFile = path.join(__dirname, 'text.txt');
fs.writeFile(
  newFile, '',
  (err) => {
    if (err) throw err;
    console.log("Категорически приветствую, введите текст который будет записан в text.txt:");
  }
);
stdin.on('data', chunk => {
  if (chunk.toString().trim() === 'exit') {
    exitFromStdin();
  } else {
    const output = fs.createWriteStream(newFile);
    output.write(chunk);
  }
}
);
process.on('SIGINT', exitFromStdin)
function exitFromStdin() {
  process.on('exit', () => console.log('Завершаю работу, разрешите откланяться.'));
  process.exit();
}