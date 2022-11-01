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
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    exitFromStdin();
  } else {
    fs.appendFile(newFile, data.toString().replace('\r\n', ''), (err) => {
      if (err) { console.log(err) };
    });

  }
}
);
process.on('SIGINT', exitFromStdin)
function exitFromStdin() {
  process.on('exit', () => console.log('Завершаю работу, разрешите откланяться.'));
  process.exit();
}