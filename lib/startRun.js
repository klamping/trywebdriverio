const fs = require('fs');
const temp = require('temp').track();
const storage = require('./storage');
const cleanScript = require('./clean');
const child = require('child_process');
const path = require('path');

module.exports = async function (req, res) {
    // get random directory
    let dirPath = temp.mkdirSync('wdioTest-');

    // get baseUrl
    const baseUrl = req.body.baseUrl;

    // clean up possible bad parts
    let cleanedScript = cleanScript(req.body.script);

    // write script to file
    fs.writeFileSync(path.join(dirPath, 'test.js'), cleanedScript);

    let runId = await storage.startRun();

    console.log(runId);

    // load standard config file
    let config = {
        baseUrl,
        specs: [path.join(dirPath, '*.js')],
        reporterOptions: {
            fileName: runId
        }
    };

    let childProcess = child.fork(path.join(__dirname, './runner.js'), process.argv.slice(2), {
        cwd: process.cwd()
    })

    childProcess
        .on('message', (msg) => {console.log('message', msg)} )
        .on('exit', (exitCode) => { console.log('test completed ' + exitCode) } )

    childProcess.send(config);

    res.setHeader('Content-Type', 'text/plain')
    res.send(process.pid)
    res.setStatus(200);
}
