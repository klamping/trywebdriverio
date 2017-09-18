const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const handleStartRequest = require('./lib/startRun');


const storage = require('./lib/storage');


app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', async function (req, res) {
    let runId = await handleStartRequest(req.body.baseUrl, req.body.script);

    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(runId);
});

// get status
app.get('/:runId', async function (req, res) {
    let runId = req.params.runId;

    let results = await storage.getResults(runId);

    res.status(200).send(results);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})