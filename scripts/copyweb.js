const os = require('os');
const path = require('path');
const exec = require('child_process').exec;

const OperatingSystem = os.platform();
const scriptName = OperatingSystem === 'win32' ? 'copyweb.bat' : 'copyweb.sh';
const copyWeb = path.join(__dirname, scriptName);

exec(copyWeb, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }

    console.log(`stdout: ${stdout}`);

    if (stderr) {
        console.error(`stderr: ${stderr}`);
    }
});
