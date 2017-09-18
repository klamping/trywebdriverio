const WebdriverIO = require('webdriverio');

function launch (config) {
  let launcher = new WebdriverIO.Launcher('./wdio.conf.js', config);

  launcher.run().then(
    (code) => process.exit(code),
    (e) => process.nextTick(() => {
      throw e
    })
  )
}

process.on('message', launch);