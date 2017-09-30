const express = require('express');
const http = require('http');
const bb = require('express-busboy');
const handleStartRequest = require('./lib/startRun');
const WebSocket = require('ws');
const storage = require('./lib/storage');

const app = express();

bb.extend(app);

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

async function runTest (testDeets, ws) {
  try {
    let {runId, run} = await handleStartRequest(testDeets.baseUrl, testDeets.script);

    run.stdout.on('data', (data) => {
      ws.send(data.toString('utf8'));
    });

    run.stderr.on('data', (data) => {
      ws.send(data.toString('utf8'));
    });

    run.on('close', (code) => {
      // save data to database?
      ws.send('Tests completed!');
    });

    ws.send('Tests started');
  } catch (err) {
    console.error(err.stack)
    ws.send('Something broke!')
  }
}

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
