const fs = require('fs');
const path = require('path');
const temp = require('temp');
const replace = require('replace');

function createDir (baseUrl, script) {
  // get random directory
  let dirPath = temp.mkdirSync({dir: '/tmp/', prefix: 'wdioTest-'});

  // copy files
  fs.writeFileSync(path.join(dirPath, 'wdio.conf.js'), fs.readFileSync('./docker/wdio/wdio.conf.js'));
  fs.writeFileSync(path.join(dirPath, 'package.json'), fs.readFileSync('./docker/wdio/package.json'));
  fs.writeFileSync(path.join(dirPath, 'README.md'), fs.readFileSync('./docker/wdio/README.md'));

  // replace baseUrl in configuration
  replace({
    regex: "'theBaseUrl'",
    replacement: `'${baseUrl}'`,
    paths: [path.join(dirPath, 'wdio.conf.js')]
  });

  // write script to file
  fs.mkdirSync(path.join(dirPath, 'test'));
  fs.writeFileSync(path.join(dirPath, 'test/test.js'), script);

  return dirPath;
}

module.exports = createDir;