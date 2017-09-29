const fs = require('fs');
const temp = require('temp');
const storage = require('./storage');
const path = require('path');
const WebSocket = require('ws');
const WebdriverIO = require('webdriverio');

const { spawn } = require('child_process');

// Automatically track and cleanup files at exit
temp.track();

const ws = new WebSocket('ws://localhost:3000');

module.exports = async function (baseUrl, script) {
    let runId = await storage.startRun();

    // get random directory
    let dirPath = temp.mkdirSync({dir: '/tmp/'}, 'wdioTest-');

    // write script to file
    fs.writeFileSync(path.join(dirPath, 'test.js'), script);

    let run = spawn(`/usr/local/bin/docker`, ["-v", `"${dirPath}":/wdio/test wdio`, "wdio", "--host", process.env.SELHOST, "--baseUrl", baseUrl]);

    run.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    run.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    return runId;
}