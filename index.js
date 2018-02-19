const express = require('express');
const http = require('http');
const bb = require('express-busboy');
const startRun = require('./lib/startRun');
const share = require('./lib/share');
const WebSocket = require('ws');
const mustacheExpress = require('mustache-express');
const defaults = require('./default-test');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

bb.extend(app);

function sendMsg (ws, data) {
  let msg = data.toString('utf8')

  if (msg.indexOf('Starting docker_selenium') === -1) {
    ws.send(data.toString('utf8'));
  }
}



async function runTest (testDeets, ws) {
  try {
    let {runId, run} = await startRun(testDeets.baseUrl, testDeets.code);

    run.stdout.on('data', sendMsg.bind(this, ws));

    run.stderr.on('data', sendMsg.bind(this, ws));

    run.on('close', (code) => {
      if (code !== 0) {
        // save broken screenshot?
      }
      // save data to database?
      if (ws) {
        ws.send('Tests completed!');
      }
    });

    ws.send('Tests started');

    ws.onclose = () => {
      console.log('client connection closed');
      run.stdin.pause();
      run.stderr.pause();
      run.kill();
      ws = null;
    }
  } catch (err) {
    console.log(err.stack);
  }
}

// save/share link
app.post('/save', async function (req, res) {
  testDeets = {
    baseUrl: req.body.baseUrl,
    file: req.body.code
  }

  // store to DB
  let id = await share.create(testDeets);

  // respond with ID of store
  res.send(id)
})

app.get('/', async function(req, res, next) {
  res.render('index', defaults);
});

app.get('/share/:tag', async function(req, res, next) {
  // // load json data from db via ID
  let content = await share.load(req.params.tag);

  res.render('index', content[0]);
});

app.use(express.static('public'))

const server = http.createServer(app);

const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws, req) => {
  ws.on('message', (message) => {
    // is request to run test?
    let testDeets = JSON.parse(message);

    if (testDeets.baseUrl && testDeets.code) {
      runTest(testDeets, ws);
    }
  });
});

//
// Start the server.
//
server.listen(3333, () => console.log('Listening on http://localhost:3333'));
