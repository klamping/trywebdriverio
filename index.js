const child = require('child_process');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

let processes = [];

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', function (req, res) {
    // add files to temp test folder
    let tempFolder = 'temp-123';

    // get baseUrl
    const baseUrl = req.body.baseUrl;

    // write script to file
    fs.writeFileSync(path.join(tempFolder, 'test.js'), req.body.script);

    // load standard config file
    let config = {
        baseUrl,
        specs: [path.join(tempFolder, '*.js')]
    };

    let childProcess = child.fork(path.join(__dirname, '/runner.js'), process.argv.slice(2), {
        cwd: process.cwd()
    })

    childProcess
        .on('message', (msg) => {console.log(msg)} )
        .on('exit', (exitCode) => { console.log('test completed ' + exitCode) } )

    childProcess.send(config);

    processes.push(childProcess);

    res.send('Test Started')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})