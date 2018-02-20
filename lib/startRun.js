const createTempDirectory = require('./createTempDirectory');
const storage = require('./storage');
const WebdriverIO = require('webdriverio');

const { spawn } = require('child_process');

module.exports = async function (baseUrl, script) {
    let runId = await storage.startRun();

    let dirPath = createTempDirectory(baseUrl, script);

    let run = spawn('/usr/local/bin/docker-compose', ['--file', './docker/docker-compose.yml', 'run', "-v", `${dirPath}/test:/wdio/test`, 'wdio', "--host", "selenium", "--baseUrl", baseUrl]);

    return {runId, run};
}