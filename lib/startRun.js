const fs = require('fs');
const temp = require('temp');
const storage = require('./storage');
const path = require('path');
const WebSocket = require('ws');
const WebdriverIO = require('webdriverio');

const { spawn } = require('child_process');

// Automatically track and cleanup files at exit
// temp.track();

module.exports = async function (baseUrl, script) {
    let runId = await storage.startRun();

    // get random directory
    let dirPath = temp.mkdirSync({dir: '/tmp/'}, 'wdioTest-');

    // write script to file
    fs.writeFileSync(path.join(dirPath, 'test.js'), script);

    let run = spawn('/usr/local/bin/docker', ['run', "-v", `${dirPath}:/wdio/test`, 'wdio', "--host", process.env.SELHOST, "--baseUrl", baseUrl]);

    return {runId, run};
}