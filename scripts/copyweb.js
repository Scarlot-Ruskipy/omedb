const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, '..', 'dist', 'web');
const srcDir = path.join(__dirname, '..', 'src', 'web');

function createDirIfNotExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function removeDir(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

function copyFiles(src, dest) {
    createDirIfNotExists(dest);
    if (os.platform() === 'win32') {
        execSync(`xcopy ${src} ${dest} /E /H /C /I`);
    } else {
        execSync(`cp -r ${src}/* ${dest}`);
    }
}

function copyWebFiles() {
    createDirIfNotExists(distDir);

    const publicDir = path.join(distDir, 'public');
    const htmlDir = path.join(distDir, 'html');

    removeDir(publicDir);
    removeDir(htmlDir);

    createDirIfNotExists(publicDir);
    createDirIfNotExists(htmlDir);

    copyFiles(path.join(srcDir, 'public'), publicDir);
    copyFiles(path.join(srcDir, 'html'), htmlDir);

    console.log('Web files copied successfully.');
}

copyWebFiles();