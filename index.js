const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const handleStartRequest = require('./lib/startRun');

let processes = [];

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', handleStartRequest);

// get status
app.get('/:runId', function (req, res) {
    let runId = req.params.runId;

    res.send(200);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})