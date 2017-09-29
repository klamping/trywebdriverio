const handleStartRequest = require('./lib/startRun');

handleStartRequest('http://brenebrown.com/', `
  describe('the homepage', function () {
    it('should load', function () {
      browser.url('./');
      let title = browser.getTitle();

      console.log('title', title)
    });
  });
`);

// process.exit(0)


// "--host", process.env.SELHOST, "--baseUrl", baseUrl