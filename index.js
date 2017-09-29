const express = require('express');
const app = express();
const http = require('http');
var bb = require('express-busboy');
const handleStartRequest = require('./lib/startRun');
const WebSocket = require('ws');

const storage = require('./lib/storage');

bb.extend(app);

app.post('/run/', async function (req, res) {
    try {
        let runId = await handleStartRequest(req.body.baseUrl, req.body.script);

        res.setHeader('Content-Type', 'text/plain')
        res.send({ result: 'OK', message: runId });
    } catch (err) {
      console.error(err.stack)
      res.status(500).send('Something broke!')
    }
});

// get status
app.get('/run/:runId', async function (req, res) {
    let runId = req.params.runId;

    let results = await storage.getRun(runId);

    res.send({ result: 'OK', message: results });
})

app.use(express.static('public'));

const server = http.createServer(app);

const wss = new WebSocket.Server({server: server});

wss.on('connection', (ws, req) => {
  ws.on('message', (message) => {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`WS message ${message}`);
  });
});

//
// Start the server.
//
server.listen(3333, () => console.log('Listening on http://localhost:3333'));
