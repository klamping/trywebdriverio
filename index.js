const express = require('express');
const http = require('http');
const bb = require('express-busboy');
const startRun = require('./lib/startRun');
const WebSocket = require('ws');

const app = express();

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
      ws.send('Tests completed!');
    });

    ws.send('Tests started');
  } catch (err) {
    console.error(err.stack)
    ws.send('Something broke!')
  }
}

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
